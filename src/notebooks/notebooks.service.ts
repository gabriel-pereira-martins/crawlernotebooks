import { Injectable } from '@nestjs/common';
import { NotebookFilterDto } from './DTOS/notebook.dto';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class NotebooksService {

  async getLastPage(): Promise<number> {
    const options = {
      method: 'GET',
      url: 'https://webscraper.io/test-sites/e-commerce/static/computers/laptops',
      headers: {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      },
    };

    try {
      const response = await axios.request(options);
      const $ = cheerio.load(response.data);

      const lastPageNumber = parseInt($('.pagination li').not('.disabled').last().prev().text(), 10);
      return lastPageNumber;
    } catch (error) {
      console.error('Erro ao carregar a página para encontrar o número da última página:', error);
      throw new Error('Erro ao carregar o número da última página.');
    }
  }

  async scrapeNotebooks(pageNumber: number) {
    const url = `https://webscraper.io/test-sites/e-commerce/static/computers/laptops?page=${pageNumber}`;
    const options = {
      method: 'GET',
      url: url,
      headers: {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      },
    };

    try {
      const response = await axios.request(options);
      const $ = cheerio.load(response.data);

      const notebooks = $('.product-wrapper.card-body');
      const allNotebooks = [];

      if (notebooks.length > 0) {
        notebooks.each((index, element) => {
          const title = $(element).find('.title').text().trim();
          const price = $(element).find('.price').text().trim();
          const description = $(element).find('.description').text().trim();

          allNotebooks.push({ title, price, description });
        });
      }

      return allNotebooks;
    } catch (error) {
      console.error(`Erro ao carregar a página ${pageNumber}:`, error);
      return [];
    }
  }

  async findNotebooks(filterDto: NotebookFilterDto) {

    const lastPage = await this.getLastPage();

    let allNotebooks = [];

    for (let page = 1; page <= lastPage; page++) {
      const notebooks = await this.scrapeNotebooks(page);
      allNotebooks = allNotebooks.concat(notebooks);
    }

    let filteredNotebooks = allNotebooks;

    if (filterDto.Models && filterDto.Models.length > 0) {
      filteredNotebooks = filteredNotebooks.filter(notebook =>
        filterDto.Models.some(model => notebook.title.toLowerCase().includes(model.toLowerCase()))
      );
    }

    if (filterDto.Order === 'ASC') {
      filteredNotebooks = filteredNotebooks.sort((a, b) => parseFloat(a.price.replace(/[^\d.-]/g, '')) - parseFloat(b.price.replace(/[^\d.-]/g, '')));
    } else if (filterDto.Order === 'DESC') {
      filteredNotebooks = filteredNotebooks.sort((a, b) => parseFloat(b.price.replace(/[^\d.-]/g, '')) - parseFloat(a.price.replace(/[^\d.-]/g, '')));
    }

    if (filteredNotebooks.length === 0) {
      return { message: 'Nenhum notebook encontrado para a marca indicada.' };
    }

    return filteredNotebooks;
  }
}
