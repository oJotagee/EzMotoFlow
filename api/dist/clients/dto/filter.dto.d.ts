import { PaginationDto } from 'src/commom/dto/pagination.dto';
export declare class FilterDto extends PaginationDto {
    status?: 'ativo' | 'inativo';
    tipo?: 'PESSOA_FISICA' | 'PESSOA_JURIDICA';
    nome?: string;
}
