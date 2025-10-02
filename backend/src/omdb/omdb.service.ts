import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';

export interface OmdbMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchResponse {
  Search: OmdbMovie[];
  totalResults: string;
  Response: string;
}

export interface OmdbErrorResponse {
  Error: string;
  Response: string;
}

@Injectable()
export class OmdbService {
  private readonly axiosInstance: AxiosInstance;
  private readonly apiKey: string;
  private readonly logger = new Logger(OmdbService.name);

  constructor() {
    this.apiKey = process.env.OMDB_API_KEY || '';
    console.log('apiKey', this.apiKey);
    this.axiosInstance = axios.create({
      baseURL: 'http://www.omdbapi.com/',
      timeout: 10000,
      params: {
        apikey: this.apiKey,
      },
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.logger.error('The OMDB API key is invalid or expired. Please check the OMDB_API_KEY configuration.');
        }

        throw new InternalServerErrorException('Error searching movies on OMDB');
      },
    );
  }

  async searchMovies(search: string, page = 1): Promise<OmdbSearchResponse> {
    const response = await this.axiosInstance.get<OmdbSearchResponse | OmdbErrorResponse>('/', {
      params: {
        s: search,
        page,
      },
    });

    if ('Error' in response.data) {
      if (response.data.Error === 'Movie not found!') throw new NotFoundException(response.data.Error);

      throw new BadRequestException(response.data.Error);
    }

    return response.data;
  }
}
