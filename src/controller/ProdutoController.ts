import { Produto } from "../model/Produto.js";
import type { Request, Response } from "express";
import { DatabaseModel } from '../model/DatabaseModel.js';

const database = new DatabaseModel();

interface ProdutoDTO {
    idProduto: number;  
    descricao: string;
    validade: Date | null;
    preco: number;
    qtdEstoque: number;
    qtdMinEstoque: number;
}

class ProdutoController extends Produto {

    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaProdutos = await Produto.listarTodosProdutos();
            return res.status(200).json(listaProdutos);
        } catch (error) {
            console.error(`Erro ao listar produtos: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao acessar lista de produtos." });
        }
    }

    static async alerta(req: Request, res: Response): Promise<Response> {
        try {
            const produtosEmAlerta = await Produto.listarProdutosEmAlerta();
            return res.status(200).json(produtosEmAlerta);
        } catch (error) {
            console.error(`Erro ao listar produtos em alerta: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao acessar produtos em alerta." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos = req.body;
            const produto = new Produto(
                dadosRecebidos.descricao,
                dadosRecebidos.preco,
                dadosRecebidos.qtdEstoque,
                dadosRecebidos.qtdMinEstoque,
                dadosRecebidos.validade
            );
            const respostaModelo = await Produto.cadastrarProduto(produto);

            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Produto cadastrado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar produto." });
            }
        } catch (error) {
            console.error(`Erro ao cadastrar produto: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao inserir produto." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const idProdutoParam = req.params.idProduto;
            const idProduto = Number(idProdutoParam);

            if (isNaN(idProduto)) {
                return res.status(400).json({ erro: 'ID do produto inválido' });
            }
            const campos = req.body;
            const atualizado = await Produto.atualizarProduto(idProduto, campos);
            console.log(idProduto, campos);

            if (atualizado) {
                return res.status(200).json({ mensagem: "Produto atualizado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao atualizar produto." });
            }
        } catch (error) {
            console.error(`Erro ao atualizar produto: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao atualizar produto." });
        }
    }

    static async deletarProduto(id: number): Promise<boolean> {
        try {
            const queryDelete = `DELETE FROM cliente WHERE id_cliente = $1;`;
            const result = await database.pool.query(queryDelete, [id]);

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error(`Erro ao deletar cliente: ${error}`);
            return false;
        }
  }

}
export default ProdutoController;