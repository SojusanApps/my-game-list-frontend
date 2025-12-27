import * as React from "react";

type AppLogoProps = {
  classNameSojusan?: string;
  classNameGameList?: string;
};

function AppLogo({
  classNameSojusan = "text-3xl text-secondary-950",
  classNameGameList = "text-4xl",
}: Readonly<AppLogoProps>): React.JSX.Element {
  return (
    <div className="flex-row text-center">
      <p className={`font-bold italic leading-none ${classNameSojusan}`}>Sojusan</p>
      <p className={`-mt-0.5 font-bold leading-none ${classNameGameList}`}>GameList</p>
    </div>
  );
}

export default AppLogo;
