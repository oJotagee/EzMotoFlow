import { PaginationDto } from 'src/commom/dto/pagination.dto';
export declare class FilterDto extends PaginationDto {
    status?: 'ativo' | 'inativo';
    placa?: string;
    nome?: string;
    anoMin?: number;
    anoMax?: number;
}
