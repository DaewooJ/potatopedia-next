import CategoryPage, { categoryMetadata } from "../../../components/CategoryPage";

export const revalidate = 3600;
export const metadata = categoryMetadata("processors");

export default function Page() {
  return <CategoryPage cat="processors" />;
}
