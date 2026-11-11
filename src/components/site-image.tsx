import Image, { type ImageProps, type StaticImageData } from "next/image";
// Foto bawaan — Unsplash License (bebas dipakai komersial, tanpa wajib atribusi).
// Hero: Khanh Do. Kekuatan & Keseimbangan: Centre for Ageing Better. Semangat: Age Cymru.
// Tentang: https://unsplash.com/photos/elderly-person-practicing-tai-chi-in-a-park-WZRgn-RwuD4
import hero from "../../public/images/hero-senam.jpg";
import kekuatan from "../../public/images/manfaat-kekuatan.jpg";
import keseimbangan from "../../public/images/manfaat-keseimbangan.jpg";
import semangat from "../../public/images/manfaat-semangat.jpg";
import taichi from "../../public/images/tentang-taichi.jpg";

const builtin: Record<string, StaticImageData> = {
  "/images/hero-senam.jpg": hero,
  "/images/manfaat-kekuatan.jpg": kekuatan,
  "/images/manfaat-keseimbangan.jpg": keseimbangan,
  "/images/manfaat-semangat.jpg": semangat,
  "/images/tentang-taichi.jpg": taichi,
};

/** Foto yang alamatnya datang dari Pengaturan Web: foto bawaan (dengan efek blur saat memuat) atau unggahan admin. */
export function SiteImage({ src, alt, ...props }: Omit<ImageProps, "src" | "placeholder"> & { src: string }) {
  const local = builtin[src];
  return <Image src={local ?? src} alt={alt} placeholder={local ? "blur" : "empty"} {...props} />;
}
