import Navbar from '@/app/ui/navbar';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col ">
      <div className="w-full flex-none">
        <Navbar />
      </div>
      {/* <div className="h-[80vh] flex-grow p-6 md:p-12">{children}</div> */}
      <div className="flex-grow">{children}</div>
    </div>
  );
}