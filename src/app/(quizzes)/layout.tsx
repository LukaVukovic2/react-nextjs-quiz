import Navigation from "@/components/shared/Navigation.tsx/Navigation";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {  
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}