using System;
using System.Collections.Generic;
using System.Linq;
using Intranet.Controllers.Base;
using Intranet.Controllers.Surfaces;
using Intranet.Models;
using Umbraco.Core.Persistence;

namespace Intranet.data.Repositories
{
    public class EquipamentosRepository : Base.BaseRepository<Models.Equipamento>
    {
        public IEnumerable<Models.QueryEquipamento> ListarEquipamentosPorStatus(Models.StatusEquipamento st)
        {
            return dbContext.Database.Fetch<Models.QueryEquipamento>(new Sql(
                    @"SELECT 
                    E.*, 
                    T.descricao AS EquipamentoTipo 
                    FROM sisEquipamentos E INNER JOIN sisEquipamentosTipo T ON T.Id = E.equipamentoTipoId
                    WHERE E.statusEquipamento = @0", (int) st)).AsEnumerable();
        }
        public IEnumerable<Models.QueryEquipamento> ListarEquipamentos()
        {
            return dbContext.Database.Fetch<Models.QueryEquipamento>(new Sql(
                @"SELECT E.*, T.descricao AS EquipamentoTipo FROM sisEquipamentos E INNER JOIN sisEquipamentosTipo T ON T.Id = E.equipamentoTipoId")).AsEnumerable();
        }
        public IEnumerable<Models.EquipamentoTipo> ListarEquipamentosTipo()
        {
            return dbContext.Database.Fetch<Models.EquipamentoTipo>(new Sql(@"SELECT * FROM sisEquipamentosTipo")).AsEnumerable();
        }
    }

    public class EquipamentosReservaRepository : Base.BaseRepository<Models.EquipamentoReserva>
    {
        public Page<Models.QueryEquipamentoReserva> ListarReservas(int p, int itensPerPage, string orderby="R.Id", string direction="DESC", string login="", string status="")
        {
            orderby = string.IsNullOrEmpty(orderby) ? "R.Id" : orderby;

            return dbContext.Database.Page<Models.QueryEquipamentoReserva>(p, itensPerPage, new Sql(string.Format(@"SELECT 
	            R.*,
	            E.descricao as EquipamentoDescricao,
                E.NumeroSerie as NumeroSerie,
                E.Modelo as Modelo,
	            T.descricao as EquipamentoTipo,
	            M.Email as Email,
	            M.LoginName as LoginName
            FROM [sisEquipamentosReserva] R
            INNER JOIN sisEquipamentos E ON E.Id = R.equipamentoId
            INNER JOIN sisEquipamentosTipo T ON T.Id = E.equipamentoTipoId
            INNER JOIN cmsMember M on M.nodeId = R.memberId
            WHERE M.LoginName like '%{2}%' AND (R.statusEquipamentoReserva = '{3}' OR '{3}' = '') 
            ORDER BY {0} {1}", orderby ?? "R.Id", direction ?? "", login ?? "", status)));
        }
        public IEnumerable<Models.QueryEquipamentoReserva> ListarReservasPorMes(int ano, int mes)
        {
            return dbContext.Database.Fetch<Models.QueryEquipamentoReserva>(new Sql(@"SELECT 
	            R.*,
	            E.Id as EquipamentoId,
	            E.descricao as EquipamentoDescricao,
                E.NumeroSerie as NumeroSerie,
                E.Modelo as Modelo,
	            T.descricao as EquipamentoTipo,
	            M.Email as Email,
	            M.LoginName as LoginName
            FROM [sisEquipamentosReserva] R
            INNER JOIN sisEquipamentos E ON E.Id = R.equipamentoId
            INNER JOIN sisEquipamentosTipo T ON T.Id = E.equipamentoTipoId
            INNER JOIN cmsMember M on M.nodeId = R.memberId
            WHERE 
                (YEAR( R.ReservaDe) = @0 AND MONTH(R.ReservaDe) = @1) OR (YEAR(R.ReservaAte) = @0 AND MONTH(R.ReservaAte) = @1)", ano, mes));
        }
        public IEnumerable<Models.QueryEquipamentoReserva> ListarReservasPorEquipamento(int IdEquipamento)
        {
            return dbContext.Database.Fetch<Models.QueryEquipamentoReserva>(new Sql(@"SELECT 
	            R.*,
	            E.Id as EquipamentoId,
	            E.descricao as EquipamentoDescricao,
                E.NumeroSerie as NumeroSerie,
                E.Modelo as Modelo,
	            T.descricao as EquipamentoTipo,
	            M.Email as Email,
	            M.LoginName as LoginName
            FROM [sisEquipamentosReserva] R
            INNER JOIN sisEquipamentos E ON E.Id = R.equipamentoId
            INNER JOIN sisEquipamentosTipo T ON T.Id = E.equipamentoTipoId
            INNER JOIN cmsMember M on M.nodeId = R.memberId
            WHERE 
                E.Id = @0 ", IdEquipamento));
        }
        public IEnumerable<Models.QueryEquipamentoReserva> ListarPorPeriodo(DateTime de, DateTime ate, int EquipamentoId, StatusEquipamentoReserva[] statusEquipamentoReserva)
        {
            return dbContext.Database.Fetch<Models.QueryEquipamentoReserva>(new Sql(@"SELECT 
	            R.*,
	            E.Id as EquipamentoId,
	            E.descricao as EquipamentoDescricao,
                E.NumeroSerie as NumeroSerie,
                E.Modelo as Modelo,
	            T.descricao as EquipamentoTipo,
	            M.Email as Email,
	            M.LoginName as LoginName
            FROM [sisEquipamentosReserva] R
            INNER JOIN sisEquipamentos E ON E.Id = R.equipamentoId
            INNER JOIN sisEquipamentosTipo T ON T.Id = E.equipamentoTipoId
            INNER JOIN cmsMember M on M.nodeId = R.memberId
            WHERE 
                ((R.reservaDe <= @1) AND (R.reservaAte >= @0)) AND
                R.statusEquipamentoReserva IN(@2) AND R.equipamentoId = @3", de, ate, statusEquipamentoReserva, EquipamentoId));
        }

        /*public Page<Models.QueryEquipamentoReserva> ListarReservasInadimplentes(int p, int itensPerPage, string orderby = "R.Id", string direction = "DESC", string login = "")
        {
            return dbContext.Database.Page<Models.QueryEquipamentoReserva>(p, itensPerPage, new Sql(string.Format(@"SELECT 
	            R.*,
	            E.descricao as EquipamentoDescricao,
                E.NumeroSerie as NumeroSerie,
                E.Modelo as Modelo,
	            T.descricao as EquipamentoTipo,
	            M.Email as Email,
	            M.LoginName as LoginName
            FROM [sisEquipamentosReserva] R
            INNER JOIN sisEquipamentos E ON E.Id = R.equipamentoId
            INNER JOIN sisEquipamentosTipo T ON T.Id = E.equipamentoTipoId
            INNER JOIN cmsMember M on M.nodeId = R.memberId
            WHERE M.LoginName like '%{2}%' AND (R.statusEquipamentoReserva = '{3}' OR '{3}' = '') AND R.ReservaAte < getDate() 
            ORDER BY {0} {1}", string.IsNullOrWhiteSpace( orderby ) ? "R.Id" : orderby, direction ?? "", login ?? "", ((int)Models.StatusEquipamentoReserva.ANDAMENTO)) ));
        }*/

        public Page<Models.EquipamentoReservaQuery> ListarReservas(Paginacao<Models.EquipamentoReservaQuery> pag)
        {
            var sql = new Sql(@"SELECT 
	                            T.[Id],
	                            T.[descricao] TipoDescricao,
	                            E.[Id] EquipamentoId,
	                            E.[equipamentoTipoId],
	                            E.[ativo],
	                            E.[numeroSerie],
	                            E.[descricao] EquipamentoDescricao,
	                            E.[modelo],
	                            E.[dataCadastro],
	                            E.[statusEquipamento],
	                            R.[Id] ReservaId,
	                            R.[memberId],
	                            R.[equipamentoId] ReservaEquipamentoId,
	                            R.[reservaDe],
	                            R.[reservaAte],
	                            R.[_motivoReserva],
	                            R.[tipoReserva],
	                            R.[dataCadastro] ReservaDataCadastro,
	                            R.[dataCancelamento],
	                            R.[_motivoCancelamento],
	                            R.[dataDevolucao],
	                            R.[statusEquipamentoReserva],
                                M.[LoginName],
	                            M.[Email]
                              FROM [dbo].[sisEquipamentosReserva] R
                              INNER JOIN [dbo].[sisEquipamentos] E ON E.Id = R.equipamentoId
                              INNER JOIN [dbo].[sisEquipamentosTipo] T ON T.Id = E.equipamentoTipoId
                              INNER JOIN cmsMember M on M.nodeId = R.memberId
                            WHERE
                              (@0 is null OR R.Id = @0) AND
                              (@1 is null OR E.Id = @1) AND
                              (@2 is null OR T.Id = @2) AND
                              (@3 is null OR LOWER(E.[descricao]) LIKE LOWER(@3)) AND
                              (@4 is null OR LOWER(T.[descricao]) LIKE LOWER(@4)) AND
                              (@5 is null OR R.reservaDe >= @5) AND
                              (@6 is null OR R.reservaAte <= @6) AND
                              (@7 is null OR LOWER(M.[LoginName]) LIKE LOWER(@7)) AND
                              (@8 is null OR R.memberId = @8) AND
                              (@9 is null OR R.statusEquipamentoReserva = @9)",
                              pag.filter.ReservaId,
                              pag.filter.EquipamentoId,
                              pag.filter.equipamentoTipoId,
                              pag.filter.EquipamentoDescricao == null ? null : String.Format("%{0}%", pag.filter.EquipamentoDescricao),
                              pag.filter.TipoDescricao == null ? null : String.Format("%{0}%", pag.filter.TipoDescricao),
                              pag.filter.reservaDe,
                              pag.filter.reservaAte,
                              pag.filter.LoginName == null ? null : String.Format("%{0}%", pag.filter.LoginName),
                              pag.filter.memberId,
                              pag.filter.statusEquipamentoReserva);

            if (pag.orderDirection == 1)
                sql.OrderByDescending(pag.orderBy);
            else
                sql.OrderBy(pag.orderBy);

            var rs = dbContext.Database.Page<Models.EquipamentoReservaQuery>(pag.currentPage, pag.pageSize, sql);
            return rs;
        }
        public Page<Models.EquipamentoReservaQuery> ListarReservasInadimplentes(Paginacao<Models.EquipamentoReservaQuery> pag)
        {
            var sql = new Sql(@"SELECT 
	                            T.[Id],
	                            T.[descricao] TipoDescricao,
	                            E.[Id] EquipamentoId,
	                            E.[equipamentoTipoId],
	                            E.[ativo],
	                            E.[numeroSerie],
	                            E.[descricao] EquipamentoDescricao,
	                            E.[modelo],
	                            E.[dataCadastro],
	                            E.[statusEquipamento],
	                            R.[Id] ReservaId,
	                            R.[memberId],
	                            R.[equipamentoId] ReservaEquipamentoId,
	                            R.[reservaDe],
	                            R.[reservaAte],
	                            R.[_motivoReserva],
	                            R.[tipoReserva],
	                            R.[dataCadastro] ReservaDataCadastro,
	                            R.[dataCancelamento],
	                            R.[_motivoCancelamento],
	                            R.[dataDevolucao],
	                            R.[statusEquipamentoReserva],
                                M.[LoginName],
	                            M.[Email]
                              FROM [dbo].[sisEquipamentosReserva] R
                              INNER JOIN [dbo].[sisEquipamentos] E ON E.Id = R.equipamentoId
                              INNER JOIN [dbo].[sisEquipamentosTipo] T ON T.Id = E.equipamentoTipoId
                              INNER JOIN cmsMember M on M.nodeId = R.memberId
                            WHERE
                              (@0 is null OR R.Id = @0) AND
                              (@1 is null OR E.Id = @1) AND
                              (@2 is null OR T.Id = @2) AND
                              (@3 is null OR LOWER(E.[descricao]) LIKE LOWER(@3)) AND
                              (@4 is null OR LOWER(T.[descricao]) LIKE LOWER(@4)) AND
                              (@5 is null OR R.reservaDe >= @5) AND
                              ( R.reservaAte <= getDate() ) AND
                              (@6 is null OR LOWER(M.[LoginName]) LIKE LOWER(@6)) AND
                              (@7 is null OR R.memberId = @7) AND
                              (@8 is null OR R.statusEquipamentoReserva = @8)",
                              pag.filter.ReservaId,
                              pag.filter.EquipamentoId,
                              pag.filter.equipamentoTipoId,
                              pag.filter.EquipamentoDescricao == null ? null : String.Format("%{0}%", pag.filter.EquipamentoDescricao),
                              pag.filter.TipoDescricao == null ? null : String.Format("%{0}%", pag.filter.TipoDescricao),
                              pag.filter.reservaDe,
                              pag.filter.LoginName == null ? null : String.Format("%{0}%", pag.filter.LoginName),
                              pag.filter.memberId,
                              Models.StatusEquipamentoReserva.ANDAMENTO);

            if (pag.orderDirection == 1)
                sql.OrderByDescending(pag.orderBy);
            else
                sql.OrderBy(pag.orderBy);

            var rs = dbContext.Database.Page<Models.EquipamentoReservaQuery>(pag.currentPage, pag.pageSize, sql);
            var LastSQL = dbContext.Database.LastSQL;
            var LastCommand = dbContext.Database.LastCommand;
            var LastArgs = dbContext.Database.LastArgs;
            return rs;
        }
    }
}