import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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

function findBetween(str: string, start: string, end: string) {
  const startIndex = str.indexOf(start) + start.length;
  const endIndex = str.indexOf(end, startIndex);
  return str.substring(startIndex, endIndex);
}

const headers = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-US,en;q=0.9,hi;q=0.8",
  "sec-ch-ua":
    '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  cookie:
    "browserid=XKfbrNhdXjhldCE2dygtEAkVm5oL0jn1X4Bm-EcBKdgmYtj2wEkSVOEgUng=; lang=en; TSID=L07LjEO7iWnaMWI1OMTIsBiDSWSHGgLD; __bid_n=18c54bfd63b9cd84b64207; _ga=GA1.1.949652122.1702228969; _ga_06ZNKL8C2E=GS1.1.1702228969.1.1.1702229022.7.0.0; ndus=Y-R0se7teHui1xLwk00ZGu3IGfxq73yKAtMVT7H2; csrfToken=zWyKhmtB13gm18-knZuFXwNs; ndut_fmt=4A0E93AE092505902850D48BE66446D62101717885B2AE820225CCE16BC12199",
};

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams: params } = new URL(req.url);
  if (!params.has("data")) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }
  const link = params.get("data");
  if (!link) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }
  try {
    const req = await axios.get(link, { headers, withCredentials: true });
    const responseData = req.data;
    const jsToken = findBetween(responseData, "fn%28%22", "%22%29");
    const logid = findBetween(responseData, "dp-logid=", "&");
    if (!jsToken || !logid) {
      return NextResponse.json({ error: "Invalid response" }, { status: 400 });
    }
    const { searchParams: requestUrl, href } = new URL(
      req.request.res.responseUrl
    );
    if (!requestUrl.has("surl")) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
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

    // const queryString = Object.keys(params)
    //   .map(
    //     (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    //   )
    //   .join("&");

    // const requestOptions = {
    //   method: "GET",
    //   headers: {
    //     ...headers,
    //     "Content-Type": "application/json", // Adjust if needed
    //   },
    //   credentials: "include", // equivalent to withCredentials in Axios
    // };

    // const response = await fetch(
    //   `https://www.terabox.app/share/list?${queryString}`,
    //   requestOptions
    // );
    const req2 = await axios.get("https://www.terabox.app/share/list", {
      params: params,
      headers,
      withCredentials: true,
    });
    const responseData2 = req2.data;
    // if (!"list" in responseData2) {
    //   return NextResponse.json({ error: "Invalid response" }, { status: 400 });
    // }
    return NextResponse.json(responseData2?.list[0], { status: 200 });
  } catch (error: Error | any) {
    console.log(error);
    return NextResponse.json({ error: "Unknown Error" }, { status: 400 });
  }
}
