"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetchWithToken = async (url: URL | RequestInfo) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorRes = await res.json();
    const error = new Error();
    error.message = errorRes?.error;
    throw error;
  }

  return await res.json();
};

function isValidUrl(url: string | URL) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

function checkUrlPatterns(url: string) {
  const patterns = [
    /ww\.mirrobox\.com/,
    /www\.nephobox\.com/,
    /freeterabox\.com/,
    /www\.freeterabox\.com/,
    /1024tera\.com/,
    /4funbox\.co/,
    /www\.4funbox\.com/,
    /mirrobox\.com/,
    /nephobox\.com/,
    /terabox\.app/,
    /terabox\.com/,
    /www\.terabox\.ap/,
    /terabox\.fun/,
    /www\.terabox\.com/,
    /www\.1024tera\.co/,
    /www\.momerybox\.com/,
    /teraboxapp\.com/,
    /momerybox\.com/,
    /tibibox\.com/,
    /www\.tibibox\.com/,
    /www\.teraboxapp\.com/,
  ];

  if (!isValidUrl(url)) {
    return false;
  }

  for (const pattern of patterns) {
    if (pattern.test(url)) {
      return true;
    }
  }

  return false;
}

export default function Home() {
  const [link, setLink] = useState("");
  const [err, setError] = useState("");
  const [token, setToken] = useState("");
  const [disableInput, setdisableInput] = useState(false);

  const { data, error, isLoading } = useSWR(
    token ? [`/api?data=${encodeURIComponent(token)}`] : null,
    ([url]) => fetchWithToken(url),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (data || error) {
      setdisableInput(false);
      setLink("");
    }
    if (err || error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [err, error, data]);

  async function Submit() {
    setError("");
    setdisableInput(true);
    if (!link) {
      setError("Please enter a link");
      return;
    }
    if (!checkUrlPatterns(link)) {
      setError("Invalid Link");
      return;
    }

    setToken(link);
  }

  return (
    <div className="pt-6 mx-12">
      <nav className="flex justify-between ">
        <div className="self-center">
          <Link href="/">Terabox Downloader</Link>
        </div>
        <ul>
          <li>
            {/* <Camera color="red" size={48} /> */}
            <Button className="bg-blue-600">
              <Link href="https://t.me/RoldexVerse">Telegram</Link>
            </Button>
          </li>
        </ul>
      </nav>
      <main className="mt-6 py-10 bg-slate-700 rounded-lg items-center flex flex-col justify-center gap-2">
        <h1 className="text-xl sm:text-3xl font-bold text-center text-white">
          Terabox Downloader
        </h1>
        <p className="text-center text-white">Enter your Terabox link below</p>
        <div className="flex flex-col justify-center ">
          <div className="self-center text-black">
            <Input
              className="max-w-80"
              placeholder="Enter the link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        </div>
        <div className="self-center">
          <Button
            className="bg-green-600"
            disabled={disableInput}
            onClick={Submit}
          >
            {isLoading && (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
            Download
          </Button>
        </div>
        {error && (
          <p className="bg-rose-500 text-white w-full text-center">
            {error.message}
          </p>
        )}
        {err && (
          <p className="bg-rose-500 text-white w-full text-center">{err}</p>
        )}
      </main>
      {data && (
        <main className="my-10 py-10 bg-slate-700 rounded-lg items-start flex flex-col justify-start gap-2">
          <div className="w-full">
            <div className="rounded-md flex justify-center items-center ">
              <Image
                className="blur-md hover:filter-none rounded-md p-3 transition duration-300 ease-in-out transform scale-100 hover:scale-110 hover:rounded-md opacity-100 hover:opacity-100 "
                style={{ objectFit: "contain" }}
                loading="lazy"
                src={data?.thumb}
                height={200}
                width={200}
                alt={""}
              />
            </div>
          </div>
          <div className="pl-3 pt-3">
            <div className="pt-10"></div>
            <h1 className="text-sm lg:text-xl text-white ">
              Title:{" "}
              <span className="text-white  text-md lg:text-2xl font-bold ">
                {data?.file_name}
              </span>
            </h1>
            <h1 className="text-sm lg:text-xl text-white ">
              File Size:{" "}
              <span className="text-white text-md lg:text-2xl font-bold ">
                {data.size}
              </span>
            </h1>
          </div>
          <Link
            href={data?.direct_link}
            target="_blank"
            rel="noopener noreferrer"
            className="py-0 text-xl font-bold text-white self-center"
          >
            <Button
              variant="default"
              className="py-0 bg-blue-700 mt-3 text-xl font-bold"
            >
              {" "}
              Download
            </Button>
          </Link>
        </main>
      )}
    </div>
  );
}
