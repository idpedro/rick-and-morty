import { AxiosInstance } from "axios";
import { Character } from "../domain/Character.model";
import { ApiInstance } from "../infra/httpClient";
import { parseParamsToQuery } from "../utils/URLParser";

type GetResponseType<T> = {
  info: {
    count: number;
    next: string;
    pages: number;
    prev?: string;
  };
  results: T;
};

type GetParams = {
  page?: number;
  name?: string;
};

export class CharacterService {
  private apiInstace: AxiosInstance;

  private path = "character";
  constructor(apiInstace: AxiosInstance) {
    this.apiInstace = apiInstace;
  }

  async get(params?: GetParams): Promise<GetResponseType<Character[]>> {
    const query = params ? parseParamsToQuery(params) : "";
    try {
      const { data } = await this.apiInstace.get<GetResponseType<Character[]>>(
        `${this.path}${query ? `?${query}` : ""}`
      );
      return data;
    } catch (error: any) {
      if (error?.response?.status === 404)
        throw new Error("Personagem não encontrado");
      console.log(error);
      throw new Error("Não foi possivel listar os personagens");
    }
  }

  async getById(id: number): Promise<GetResponseType<Character>> {
    if (!id) throw new Error("O id não pode ser vazio");
    try {
      const { data } = await this.apiInstace.get<GetResponseType<Character>>(
        this.path
      );
      return data;
    } catch (error: any) {
      if (error?.code === 404) throw new Error("Personagem não encontrado");

      throw new Error("Não foi possivel buscar o pessoangem");
    }
  }
}

export default new CharacterService(ApiInstance);
