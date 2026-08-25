import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-black mb-4">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-slate-400 text-sm mb-6 max-w-md">
        요청하신 페이지가 존재하지 않거나 주소가 변경되었습니다.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
      >
        Calamus 포털 메인으로 이동
      </Link>
    </div>
  );
}
