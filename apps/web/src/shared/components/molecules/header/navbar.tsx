"use client";

import { Category } from "@/features/homepage/api/get-category";
import { PAGES_PATHS } from "@/lib/routes/paths-en";
import { NAV_USER_LINKS } from "@/lib/utils/constants/header";
import { setItem } from "@/lib/utils/local-storage";
import { Input, Logo, Skeleton } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "../../../../../../../packages/ui/src/icons/menu.icon";
import { Search } from "../../../../../../../packages/ui/src/icons/search.icon";
import { Currency } from "./currency";
import NavbarResponsive from "./navbar-responsive";

const NavBarHeaders = ({
  main_category,
  secondary_category,
}: {
  main_category: Category[];
  secondary_category: Category[];
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = useTranslations("HomePage.header");

  return (
    <>
      <div className="relative flex items-center justify-between h-20">
        <div className="flex items-center space-x-12 ">
          <Link
            href="/"
            className="text-[3.5rem] font-bold tracking-wider text-black font-bebas-neue"
          >
            <Logo />
          </Link>
          <div className=" max-md:hidden flex text-[1.2rem] text-black items-center space-x-6">
            {main_category ? (
              main_category.map((items: Category, index: number) => (
                <Link
                  key={index}
                  href={PAGES_PATHS.pageDetail(items.slug)}
                  onClick={() => setItem("links", items.name)}
                  className="font-black text-[#262626] hover:text-black text-[16px]"
                >
                  {items.name}
                </Link>
              ))
            ) : (
              <Skeleton className="h-9 w-[20rem] " />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center justify-start w-full gap-2 py-1 text-gray-500 border-b border-gray-300 px- outline-gray-700 max-sm:hidden ">
              <Search className="" />
              <Input
                placeholder={t("placeholder")}
                className="h-4 border-none outline-1 text-black font-light px-2 py-4 border-gray-300  text-[1.8rem] max-sm:hidden w-full sm:w-[28rem] placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.5rem] "
              />
            </div>
            <div className="max-md:hidden">
              <Currency />
            </div>

            <div className="flex items-center justify-center gap-0 md:gap-2">
              {NAV_USER_LINKS.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  aria-label="Liste de souhaits"
                  className={cn(
                    "relative p-3 text-black transition-colors rounded-full hover:bg-gray-100  hover:[&>span]:flex" +
                      (item.visible ? " relative " : " ")
                  )}
                >
                  {item.infos?.count && (
                    <p className="absolute flex items-center justify-center text-[0.8rem] border bottom-2 right-2  text-center content-center w-[1.5rem] h-[1.5rem] lg:w-[1.8rem] lg:h-[1.8rem] text-xs text-white bg-red-500 rounded-full lg:right-2 lg:bottom-0 lg:text-[1rem] font-semibold lg:border-2 lg:p-2 border-white">
                      {item.infos.count}
                    </p>
                  )}
                  <item.icon className="" />
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-gray-600 hover:text-black focus:outline-none"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-10 h-10" />
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <NavbarResponsive
            close={() => setIsMobileMenuOpen(false)}
            onClick={() => setIsMobileMenuOpen(false)}
            main_category={main_category}
            secondary_category={secondary_category}
          />
        )}{" "}
      </div>
    </>
  );
};

export default NavBarHeaders;
