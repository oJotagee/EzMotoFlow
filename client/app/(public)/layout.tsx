import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full flex bg-cover orange">
      <div className="z-10 w-screen min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
