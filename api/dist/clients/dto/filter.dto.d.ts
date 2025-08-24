import { PaginationDto } from 'src/commom/dto/pagination.dto';
export declare class FilterDto extends PaginationDto {
    status?: 'ativo' | 'inativo';
    nome?: string;
}
