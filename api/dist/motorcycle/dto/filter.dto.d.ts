import { PaginationDto } from 'src/commom/dto/pagination.dto';
export declare class FilterDto extends PaginationDto {
    status?: 'ativo' | 'inativo' | 'vendido' | 'andamento';
    placa?: string;
    nome?: string;
    anoMin?: number;
    anoMax?: number;
}
