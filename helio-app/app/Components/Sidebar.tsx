"use client";

import { useHandleLogout } from "./handleLogout";

export default function Sidebar() {

    const handleLogout = useHandleLogout();
    return (
        <aside className="flex">

            <div className="flex flex-col items-center justify-between w-16 h-screen py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700">
                <div className="flex flex-col items-center space-y-8" >
                    <a href="#">
                        <img src="/icons/Logo.png" alt="Home" className="w-12 h-12" />
                    </a>


                    <a href="#" className="p-0">
                        <img src="/icons/home.png" alt="Home" className="w-9 h-9" />
                    </a>
                </div>

                <div>
                    <a href="/" 
                        onClick={(e) => {
                        e.preventDefault(); 
                        handleLogout();     
                    }}>

                        {/* Logout icon */}
                        <img src="/icons/logout.png" alt="Home" className="w-9 h-9" />

                    </a>
                </div>


            </div>

            {/* Right accounts list */}
            <div className="h-screen py-8 overflow-y-auto bg-white border-l border-r sm:w-64 w-60 dark:bg-gray-900 dark:border-gray-700">
                <h2 className="px-5 text-lg font-medium text-gray-800 dark:text-white">Accounts</h2>

                <div className="mt-8 space-y-4">
                    {/* Example account */}
                    <button className="flex items-center w-full px-5 py-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 gap-x-2 focus:outline-none">
                        <img
                            className="object-cover w-8 h-8 rounded-full"
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?...q=100"
                            alt="Mia John"
                        />
                        <div className="text-left">
                            <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">hellen John</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">How is it going ? </p>
                        </div>
                    </button>

                    {/* Repeat for other accounts */}
                </div>
            </div>
        </aside>
    );
}
