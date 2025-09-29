import { Button } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const Hero = () => {
  const t = useTranslations("HomePage.hero");

  return (
    <div className=" relative h-[90vh] -z-0 w-full overflow-hidden bg-gray-100  ">
      <Image
        src="/home/cover-desktop-1.jpg"
        alt="Hero background image"
        layout="fill"
        objectFit="cover"
        className="absolute top-0 left-0 z-10 w-full h-full max-md:hidden md:flex"
        priority
      />
      <Image
        src="/home/cover-phone.jpg"
        alt="Hero background image"
        className="absolute top-0 left-0 z-10 w-full h-full max-md:flex md:hidden"
        priority
        fill
      />
      <Container
        maxWidth="100vw"
        className="flex flex-col items-center justify-center h-full space-y-12 lg:px-40 bg-none/30 "
      >
        <div className="flex items-end justify-center w-full h-full text-white z-15 lg:p-8 rounded-xl md:justify-start">
          <div className="pb-40 space-y-8 md:w-1/2 max-md:w-full max-lg:pb-20 lg: max-md:text-center">
            <h1 className="!text-[3rem]  md:!text-[4.5rem] lg:!text-[5.5rem] leading-[6.5rem] tracking-tight font-normal text-center md:text-start   ">
              {t("title")}
            </h1>
            <p className="mt-8 text-[1.5rem] max-md:hidden lg:text-[1.8rem] font-light leading-[1.5] text-pretty  lg:text-justify">
              {t("subtitle")}
            </p>
            <Button
              variant="secondary"
              className="size-fit bg-none backdrop-blur-3xl"
            >
              {t("ctaButton")}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
