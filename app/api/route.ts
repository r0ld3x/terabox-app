import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";

function getFormattedSize(sizeBytes: number) {
  let size, unit;

  if (sizeBytes >= 1024 * 1024) {
    size = sizeBytes / (1024 * 1024);
    unit = "MB";
  } else if (sizeBytes >= 1024) {
    size = sizeBytes / 1024;
    unit = "KB";
  } else {
    size = sizeBytes;
    unit = "bytes";
  }

  return `${size.toFixed(2)} ${unit}`;
}

if (!env.COOKIE) {
  throw new Error("Missing COOKIE in env");
}

interface ResponseData {
  file_name: string;
  link: string;
  direct_link: string;
  thumb: string;
  size: string;
  sizebytes: number;
}

function findBetween(str: string, start: string, end: string) {
  const startIndex = str.indexOf(start) + start.length;
  const endIndex = str.indexOf(end, startIndex);
  return str.substring(startIndex, endIndex);
}

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams: params } = new URL(req.url);
  if (!params.has("data")) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }
  const link = params.get("data");
  if (!link) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }
  const axiosInstance = axios.create({
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
      Connection: "keep-alive",
      DNT: "1",
      Host: "www.terabox.app",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      Cookie: env.COOKIE,
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
    },
  });
  try {
    const tempReq = await axiosInstance.get(link);

    if (!tempReq)
      return NextResponse.json({ error: "Unknown Error" }, { status: 400 });
    const { searchParams: requestUrl, href } = new URL(
      tempReq.request.res.responseUrl
    );
    if (!requestUrl.has("surl")) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }
    const req = await axiosInstance.get(tempReq.request.res.responseUrl);
    const respo = await req.data;
    const jsToken = findBetween(respo, "fn%28%22", "%22%29");
    const logid = findBetween(respo, "dp-logid=", "&");
    const bdstoken = findBetween(respo, 'bdstoken":"', '"');
    if (!jsToken || !logid || !bdstoken) {
      return NextResponse.json({ error: "Invalid response" }, { status: 400 });
    }
    const surl = requestUrl.get("surl");
    const params = {
      app_id: "250528",
      web: "1",
      channel: "dubox",
      clienttype: "0",
      jsToken: jsToken,
      "dp-logid": logid,
      page: "1",
      num: "20",
      by: "name",
      order: "asc",
      site_referer: href,
      shorturl: surl,
      root: "1,",
    };
    const req2 = await axiosInstance.get("https://www.terabox.app/share/list", {
      params: params,
    });
    const responseData2 = req2.data;
    if (
      !responseData2 ||
      !("list" in responseData2) ||
      !responseData2["list"] ||
      responseData2["errno"]
    ) {
      return NextResponse.json({ error: "Unknown Error" }, { status: 400 });
    }
    const directLinkResponse = await axiosInstance.head(
      responseData2["list"][0]["dlink"],
      {
        withCredentials: false,
      }
    );
    const direct_link = directLinkResponse.request.res.responseUrl;
    const data: ResponseData = {
      file_name: responseData2["list"][0]["server_filename"],
      link: responseData2["list"][0]["dlink"],
      direct_link: direct_link,
      thumb: responseData2["list"][0]["thumbs"]["url3"],
      size: getFormattedSize(parseInt(responseData2["list"][0]["size"])),
      sizebytes: parseInt(responseData2["list"][0]["size"]),
    };
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Unknown Error" }, { status: 400 });
  }
}
