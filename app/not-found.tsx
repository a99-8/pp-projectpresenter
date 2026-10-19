import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="font-mono text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">الصفحة غير موجودة</h1>
      <p className="mt-2 text-muted-foreground">
        ربما انتقل المشروع لمكان آخر، أو كُتب الرابط خطأً.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-8" })}>
        <Compass className="size-4" />
        العودة للرئيسية
      </Link>
    </div>
  );
}
