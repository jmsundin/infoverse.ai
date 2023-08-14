import Link from "next/link";
import { RiCopyrightLine } from "react-icons/ri";
import { BsLinkedin } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { BsGithub } from "react-icons/bs";

function Footer() {
  return (
    <footer className="absolute left-0 right-0">
      <div className="flex flex-row justify-center text-white p-4">
        <div className="bg-gradient-to-r from-gray-500 to-white h-0.5 w-5/6 mx-auto">
          {/* Social Media Links */}
          <div className="flex flex-row justify-between p-3 gap-3 text-white text-base sm:text-2xl">
            <div className="flex flex-row gap-4">
              <Link
                href="https://www.linkedin.com/company/infoverse-ai/"
                target="_blank"
                className="flex justify-center items-center"
              >
                <span className="text-white hover:text-indigo-200">
                  <BsLinkedin />
                </span>
              </Link>{" "}
              <Link
                href="https://www.twitter.com/jonsundin/"
                target="_blank"
                className="flex justify-center items-center"
              >
                <span className="text-white hover:text-indigo-200">
                  <BsTwitter />
                </span>
              </Link>{" "}
              <Link
                href="https://github.com/jmsundin/infoverse.ai"
                target="_blank"
                className="flex justify-center items-center"
              >
                <span className="text-white hover:text-indigo-200">
                  <BsGithub />
                </span>
              </Link>{" "}
            </div>
            <div className="text-gray-200 text-base font-bold flex justify-center items-center gap-2">
              <RiCopyrightLine className="inline-block" />
              {" "}
              <span>Infoverse AI 2023</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
