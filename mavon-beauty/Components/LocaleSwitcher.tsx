// components/LocaleSwitcher.tsx
"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (newLocale: string) => {
    startTransition(() => {
      // Remove current locale from pathname
      const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "");

      // Navigate to new locale
      router.replace(`/${newLocale}${pathWithoutLocale || "/"}`);
    });
  };

  return (
    <div>
      <button onClick={() => onSelectChange("en")}>EN</button>
      <button onClick={() => onSelectChange("az")}>AZ</button>
      <button onClick={() => onSelectChange("ru")}>RU</button>
    </div>
  );
}
