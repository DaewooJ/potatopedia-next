import CategoryPage, { categoryMetadata } from "../../../components/CategoryPage";

export const revalidate = 3600;
export const metadata = categoryMetadata("seed");

export default function Page() {
  return <CategoryPage cat="seed" />;
}
