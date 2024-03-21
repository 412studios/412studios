export function Footer() {
  return (
    <footer className="bg-background text-foreground border-border border-t p-4">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="mb-4 text-lg font-bold">Social Links</h2>
          <ul>
            <li>
              <a
                href="https://www.instagram.com/itsfouronetwo/"
                className="text-primary"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/fouronetwostudios/"
                className="text-primary"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/channel/UCiIHqiNLRHtjsaKBVRh0ipQ"
                className="text-primary"
              >
                Youtube
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@412.studios"
                className="text-primary"
              >
                TikTok
              </a>
            </li>
            <li>
              <a href="https://twitter.com/The412Show" className="text-primary">
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://soundcloud.com/412studios"
                className="text-primary"
              >
                Soundcloud
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-lg font-bold">Contact</h2>
          <p>
            Email:{" "}
            <a href="mailto:Info@412studios.ca" className="text-primary">
              Info@412studios.ca
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:647-540-2321" className="text-primary">
              647-540-2321
            </a>
          </p>
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold">About 412 Studios</h2>
          <p>
            A professional recording studio and a vibrant incubator for artistic
            expression.
          </p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p>
          &copy; {new Date().getFullYear()} 412 Studios. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
