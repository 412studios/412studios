import { Logo } from "@/public/icons/logo";
import { LogoV } from "@/public/icons/logo-v";

export function Footer() {
  return (
    <footer className="mt-8 max-w-screen-xl w-full border-0 border-b-0 mx-auto rounded-t-xl bg-primary text-background">
      {/* FOOTER TITLE */}
      <div className="flex p-4 pb-3 border-b-4 border-background card-title text-background align-middle">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2"
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="black"
            strokeWidth="2"
            className="fill-background stroke-background"
          />
        </svg>
        <h3 className="text-2xl font-semibold leading-none font-forma tracking-wide">
          412 Studios
        </h3>
      </div>
      {/* FOOTER DETAILS */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div>
            <h4 className="text-2xl mb-4">Toronto</h4>
            <p>
              <a href="mailto:Info@412studios.ca" className="hover:underline">
                Info@412studios.ca
              </a>
            </p>
            <p>
              <a href="tel:647-540-2321" className="hover:underline">
                647-540-2321
              </a>
            </p>
            <p>
              <b>
                412 Richmond St E,
                <br />
                Toronto, ON M5A 1P8
              </b>
            </p>
          </div>
          <div>
            <h4 className="text-2xl mb-4 md:mt-0 mt-4">Follow Us</h4>
            <ul>
              <li>
                <a
                  href="https://www.instagram.com/itsfouronetwo/"
                  className="text-background hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCiIHqiNLRHtjsaKBVRh0ipQ"
                  className="text-background hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@412.studios"
                  className="text-background hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://soundcloud.com/412studios"
                  className="text-background hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Soundcloud
                </a>
              </li>
            </ul>
          </div>
          <div className="pb-4 md:pb-0">
            <LogoV className="max-h-48 w-[60px] float-right md:block hidden" />
            <Logo className="w-full max-w-[300px] mt-4 md:hidden block " />
          </div>
        </div>
      </div>
    </footer>
  );
}
