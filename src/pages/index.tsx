import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "../components/Card";
import ErrorCard from "../components/ErrorCard";
import { Character } from "../domain/Character.model";
import { useDebounce } from "../hooks/useDebounce";
import CharacterService from "../services/characterService";
import { getPageInfo } from "../utils/URLParser";
import styles from "../styles/Home.module.scss";

type PageInfo = {
  nextPage: number | null;
  previosPage: number | null;
};
interface HomeProps {
  characterList: Character[];
  pageInfo: PageInfo;
  query: { [key: string]: any };
  error?: string;
}

const Home = ({
  characterList,
  pageInfo: initialPageInfo,
  query: initialQuery,
  error,
}: HomeProps) => {
  const [page, setPage] = useState<number>(initialQuery?.page);
  const [pagesInfo, setPagesInfo] = useState<PageInfo>(initialPageInfo);
  const [erro, setError] = useState<string | undefined>(error);
  const [allCharacterList, setAllCharacterList] =
    useState<Character[]>(characterList);
  const [searchName, setSearchName] = useState<string>(initialQuery?.name);

  const searchNameDebounced = useDebounce(searchName, 500);

  const handlerSearchCharacter = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchName(event.currentTarget.value);
      setPage(1);
    },
    []
  );

  const handlerChangePage = useCallback(
    (action: "next" | "previos") => () => {
      const newPage =
        action === "next"
          ? pagesInfo.nextPage
          : (pagesInfo.previosPage as number);
      setPage(newPage ?? 1);
    },
    [pagesInfo]
  );

  useEffect(() => {
    const getCharacterList = async () => {
      try {
        const { results, info } = await CharacterService.get({
          page: page,
          name: searchNameDebounced,
        });

        setPagesInfo(getPageInfo(info));
        if (results.length > 1) {
          setAllCharacterList(results);
        }
        setError(undefined);
      } catch (error: any) {
        setError(error.message);
      }
    };
    if (page != initialQuery?.page || searchNameDebounced != initialQuery?.name)
      getCharacterList();
  }, [searchNameDebounced, page, initialQuery]);

  return (
    <>
      <Head>
        <title>Base de Dados interdimencional</title>
        <meta
          name="description"
          content=" projeto feito no Live code do rank my app"
        />
      </Head>
      <main>
        <section className={styles.main__section}>
          <div>
            <button
              disabled={pagesInfo.previosPage ? false : true}
              onClick={handlerChangePage("previos")}
            >
              Anterior
            </button>
            <input
              type="text"
              onChange={handlerSearchCharacter}
              defaultValue={initialQuery?.name}
            />
            <button
              disabled={pagesInfo.nextPage ? false : true}
              onClick={handlerChangePage("next")}
            >
              Próxima
            </button>
          </div>
          {erro && <ErrorCard error={erro} />}
          {!erro && (
            <div className={styles.card__container}>
              {allCharacterList.map((character) => (
                <Card key={`character.${character.id}`} character={character} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { page, name } = context.query;
  try {
    const { results, info } = await CharacterService.get({
      page: Number(page as string),
      name: name as string,
    });
    const pageInfo = getPageInfo(info);
    return {
      props: {
        characterList: results,
        pageInfo,
        query: { page: page ?? null, name: name ?? "" },
      },
    };
  } catch (error: any) {
    return {
      props: {
        characterList: [],
        pageInfo: {},
        query: { page: page ?? null, name: name ?? "" },
        error: error.message,
      },
    };
  }
}

export default Home;
