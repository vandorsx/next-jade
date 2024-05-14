"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
   ArrowLongRightIcon,
   ChatBubbleOvalLeftEllipsisIcon,
   ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { formatTimeRelatively } from "@/app/_lib/relativeTime";
import { commit_mono } from "@/app/_fonts/fonts";

type HeaderProps = {
   inFeed?: boolean;
   preload?: boolean;
   show_updated?: boolean;
   dynamic_time?: boolean;
   post_id?: string;
   date_published: string;
   date_modified?: string;
   init_rel_date_published: string;
   init_rel_date_modified?: string | null;
};

export default function Header({
   inFeed,
   preload,
   show_updated,
   dynamic_time,
   post_id,
   date_published,
   date_modified,
   init_rel_date_published,
   init_rel_date_modified,
}: HeaderProps) {
   const date = date_published ? new Date(date_published.split("T")[0]) : null;
   const year = date ? date.getUTCFullYear() : null;
   const month = date ? date.getUTCMonth() + 1 : null;
   const day = date ? date.getUTCDate() : null;
   const dynamic_time_bool = dynamic_time ? true : false;

   const [relativeTimePublished, setRelativeTimePublished] = useState(
      init_rel_date_published,
   );
   const [relativeTimeModified, setRelativeTimeModified] = useState(
      init_rel_date_modified || null,
   );
   useEffect(() => {
      setRelativeTimePublished(
         formatTimeRelatively(date_published, dynamic_time_bool),
      );
      if (date_modified) {
         setRelativeTimeModified(
            formatTimeRelatively(date_modified, dynamic_time_bool),
         );
      }

      if (!dynamic_time_bool) return;

      const interval = setInterval(() => {
         setRelativeTimePublished(
            formatTimeRelatively(date_published, dynamic_time_bool),
         );
         if (date_modified) {
            setRelativeTimeModified(
               formatTimeRelatively(date_modified, dynamic_time_bool),
            );
         }
      }, 1000);

      return () => clearInterval(interval);
   }, [date_published, date_modified, dynamic_time_bool]);

   return (
      <header className="flex items-center gap-2">
         {inFeed && year && month && day && post_id ?
            <Link
               href={`/microblog/${year}/${month}/${day}/${post_id}`}
               className="u-url mr-1 rounded-full bg-blue-50 px-1.5 transition-all ease-out hover:scale-105 hover:bg-blue-100
              dark:bg-violet-500 dark:bg-opacity-20 dark:hover:bg-violet-500 dark:hover:bg-opacity-30"
               aria-label="Open post"
               prefetch={preload}
            >
               <ArrowLongRightIcon className="h-3.5 w-3.5 text-blue-500 dark:text-violet-400" />
            </Link>
         :  <ChatBubbleOvalLeftEllipsisIcon className="h-3.5 w-3.5 text-gray-500 dark:text-stone-400" />
         }

         <time
            dateTime={date_published}
            className={clsx(
               `${commit_mono.className} text-[calc(1em-1px)] text-gray-500 dark:text-stone-400`,
               {
                  "text-[calc(1em-2px)]": inFeed,
               },
            )}
            title={new Date(date_published).toLocaleString()}
         >
            {relativeTimePublished}
         </time>
         {date_modified && show_updated ?
            <>
               <ChevronDoubleRightIcon
                  className={clsx(
                     "h-3.5 w-3.5 text-gray-300 dark:text-stone-600",
                     {
                        "h-3 w-3": inFeed,
                     },
                  )}
               />
               <time
                  dateTime={date_modified}
                  className={clsx(
                     `${commit_mono.className} text-[calc(1em-1px)] text-gray-500 dark:text-stone-400`,
                     {
                        "text-[calc(1em-2px)]": inFeed,
                     },
                  )}
                  title={new Date(date_modified).toLocaleString()}
               >
                  {relativeTimeModified}
               </time>
            </>
         :  ""}
      </header>
   );
}
