import React from "react";
import Link from "next/link";
import GitHub from 'images/github.svg'
import Image from "next/image";
import {useRouter} from "next/router";

// style="background-color: #f1f1f1;"
function Footer() {
    const router = useRouter();

    const home: boolean = router.pathname === '/';
    return (
        <footer
            className="text-center grid grid-cols-12 justify-start
             content-start items-start h-24 absolute bottom-0 w-full">


            <div className={home ? "col-start-2 col-end-12" : "col-start-1 col-end-13"}>
                <div className="grid grid-cols-3 align-bottom">
                    <div className="bg-black rounded col-start-1 h-[2px] col-end-13 mb-8"/>
                    <div className="flex justify-between col-start-1 col-end-13">
                        <div className="text-left pl-1 text-2xl w-fit">
                            support@daily-mephi.ru
                        </div>

                        <div className="text-center text-2xl h-max-auto">
                            © {new Date().getFullYear()} Daily MEPhi
                        </div>
                        <div
                            className="flex justify-end gap-3 text-2xl">
                            <Link href="https://github.com/MEPhI-Floppas/daily-mephi" passHref>
                                <div className="w-8 h-8 flex">
                                    <Image
                                        src={GitHub}
                                        alt="GitHub"
                                        className="cursor-pointer"
                                    />
                                </div>
                            </Link>
                            <Link href="https://github.com/MEPhI-Floppas/daily-mephi" passHref>

                                <div className="cursor-pointer flex">github.com</div>

                            </Link>

                        </div>
                    </div>
                </div>
            </div>


        </footer>
    );

}

export default Footer;
