import Sidebar from '@/components/organisms/Sidebar';
import RelatedSidebar from '@/features/article/components/organisms/RelatedSidebar';
import ArticleHeader from '@/features/article/components/organisms/ArticleHeader';
import Discussion from '@/features/article/components/organisms/Discussion';
import Photo from '@/features/article/components/atoms/Photo';

export default function ArticlePage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] justify-center grow py-10">
            <div className="hidden lg:flex justify-end">
                <Sidebar />
            </div>
            <main className="flex flex-col gap-[30px] px-10">
                <section className="flex flex-col gap-[10px]">
                    <ArticleHeader />
                    <Photo source="/image.jpg" />
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                        exercitationem reiciendis ducimus eligendi veritatis eaque dolorum
                        sed maiores voluptatem soluta dolores placeat nam tenetur
                        accusantium dicta, dolorem perspiciatis voluptatum hic. Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Deserunt voluptatem
                        doloremque autem velit itaque atque perspiciatis, excepturi,
                        exercitationem vitae asperiores minus libero nostrum deleniti alias
                        dolore non numquam eligendi reprehenderit? Lorem ipsum dolor sit
                        amet consectetur adipisicing elit. Totam sint, facilis alias aliquid
                        ab repudiandae facere vel numquam deserunt. Architecto impedit vel
                        consequuntur libero officiis harum eos in error dicta?
                    </p>
                    <Photo source="/image.jpg" />
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                        exercitationem reiciendis ducimus eligendi veritatis eaque dolorum
                        sed maiores voluptatem soluta dolores placeat nam tenetur
                        accusantium dicta, dolorem perspiciatis voluptatum hic. Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Deserunt voluptatem
                        doloremque autem velit itaque atque perspiciatis, excepturi,
                        exercitationem vitae asperiores minus libero nostrum deleniti alias
                        dolore non numquam eligendi reprehenderit? Lorem ipsum dolor sit
                        amet consectetur adipisicing elit. Totam sint, facilis alias aliquid
                        ab repudiandae facere vel numquam deserunt. Architecto impedit vel
                        consequuntur libero officiis harum eos in error dicta?
                    </p>
                    <Photo source="/image.jpg" />
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                        exercitationem reiciendis ducimus eligendi veritatis eaque dolorum
                        sed maiores voluptatem soluta dolores placeat nam tenetur
                        accusantium dicta, dolorem perspiciatis voluptatum hic. Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Deserunt voluptatem
                        doloremque autem velit itaque atque perspiciatis, excepturi,
                        exercitationem vitae asperiores minus libero nostrum deleniti alias
                        dolore non numquam eligendi reprehenderit? Lorem ipsum dolor sit
                        amet consectetur adipisicing elit. Totam sint, facilis alias aliquid
                        ab repudiandae facere vel numquam deserunt. Architecto impedit vel
                        consequuntur libero officiis harum eos in error dicta?
                    </p>
                </section>
                <Discussion />
            </main>
            <div className="hidden lg:block grow">
                <RelatedSidebar />
            </div>
        </div>
    );
}
