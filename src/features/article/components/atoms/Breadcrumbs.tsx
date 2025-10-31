import { BreadcrumbsType } from '../../types/article.types';

export default function Breadcrumbs({ link }: BreadcrumbsType) {
    return <p>{link}</p>;
}
