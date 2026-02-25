import Link from "next/link";
import { Map, MapPin } from "lucide-react";
import ConstituencyQuickNav from "@/components/ConstituencyQuickNav";
import ConstituenciesMapSingleSection from "@/components/ConstituenciesMapSingleSection";
import CityGisMapSection from "@/components/CityGisMapSection";
import CityCorporationCombinedTableSection from "@/components/CityCorporationCombinedTableSection";

export default function Home() {
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">
      
      {/* Abstract Background Shapes */}
      <div className="fixed top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="fixed bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-200/40 blur-3xl" />
      
      <div className="relative z-10 mx-auto max-w-7xl space-y-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
          Dhaka Election <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Atlas</span>
        </h1>
        
        <p className="mx-auto max-w-3xl text-sm text-gray-600 md:text-base">
          Explore interactive election data, historic trends, and constituency boundaries for Dhaka North, Dhaka South, and National Elections.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link 
            href="/constituencies" 
            className="flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-transform transform hover:scale-105 shadow-xl hover:shadow-indigo-500/30 w-full sm:w-auto"
          >
            <Map className="mr-2 w-4 h-4" />
            Explore All Constituencies
          </Link>
          <div className="flex gap-4 w-full sm:w-auto">
            <Link 
              href="/dhaka-north" 
              className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-white text-indigo-700 border-2 border-indigo-100 hover:border-indigo-300 rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              <MapPin className="mr-2 w-4 h-4 text-indigo-400" />
              DNCC
            </Link>
            <Link 
              href="/dhaka-south" 
              className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-white text-indigo-700 border-2 border-indigo-100 hover:border-indigo-300 rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              <MapPin className="mr-2 w-4 h-4 text-indigo-400" />
              DSCC
            </Link>
          </div>
        </div>

        <ConstituencyQuickNav />
        <ConstituenciesMapSingleSection />
        <CityGisMapSection />
        <CityCorporationCombinedTableSection />
      </div>
    </div>
  );
}
