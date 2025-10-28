type BreadcrumbsType = {
    link: string;
};

export default function Breadcrumbs({ link }: BreadcrumbsType) {
    return <p>{link}</p>;
}
