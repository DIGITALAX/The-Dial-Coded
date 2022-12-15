import { NextPage } from "next";
import explorePublications from "../../graphql/queries/explorePublications";

export const getStaticPaths = async () => {
  const response = await explorePublications({
    sources: "thedial",
    publicationTypes: ["POST", "COMMENT", "MIRROR"],
    limit: 20,
    sortCriteria: sortCriteria,
    noRandomize: true,
  });
  const product = await response.json();
  const paths = product?.map((item) => {
    return {
      params: {
        slug: item.slug,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps = async (context: any) => {
  const productSlug: string = context.params.slug;
  const response = await fetch(`${BASE_URL}/api/products/${productSlug}`);
  const data: ProductInterface = await response.json();
  return {
    props: { item: data },
    revalidate: 30,
  };
};

const Handle: NextPage<HandleProps> = ({ item }): JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setCurrency({
        actionSlug: item?.slug,
      })
    );
    dispatch(setMain(item?.mainImage as string));
    dispatch(setFeatured(item?.featuredImages as string[]));
  }, []);

  return (
    <div className="relative h-full w-full bg-black grid grid-flow-row auto-rows-[auto auto] overflow-hidden">

    </div>
  );
};

export default Handle;
