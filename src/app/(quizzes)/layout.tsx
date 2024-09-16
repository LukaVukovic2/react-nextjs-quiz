import Navigation from "@/components/shared/Navigation.tsx/Navigation";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {  
  return (
    <div>
      <Navigation />
      <div>
        {children}
      </div>
    </div>
  );
}