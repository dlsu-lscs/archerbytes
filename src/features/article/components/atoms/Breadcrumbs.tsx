import { BreadcrumbsType } from '../../types/article.types';

export default function Breadcrumbs({ link }: BreadcrumbsType) {
    return <p className="font-bold text-neutral-950 text-sm">{link}</p>;
}
