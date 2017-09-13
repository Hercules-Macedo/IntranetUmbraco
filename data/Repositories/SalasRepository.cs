using System;
using System.Collections.Generic;
using System.Linq;
using Intranet.Controllers.Surfaces;
using Intranet.Models;
using Umbraco.Core.Persistence;
using Intranet.Controllers.Base;

namespace Intranet.data.Repositories
{
    public class SalasRepository : Base.BaseRepository<Models.Sala>
    {
        public IEnumerable<Models.Sala> ListarSalas()
        {
            return dbContext.Database.Fetch<Models.Sala>(new Sql(@"SELECT * FROM sisSalas")).AsEnumerable();
        } 
    }

    public class SalaReservaRepository : Base.BaseRepository<Models.SalaReserva>
    {
        public Page<Models.QuerySalasReserva> ListarReservas(int p, int itensPerPage, string orderby = "R.Id", string direction = "DESC", string login = "", string status = "")
        {
            orderby = string.IsNullOrEmpty(orderby) ? "R.Id" : orderby;

            Dictionary<string, string> fields = new Dictionary<string, string>();
            fields.Add("Id", "R.Id");
            fields.Add("Login", "M.LoginName");
            fields.Add("Email", "M.Email");
            fields.Add("SalaDescricao", "S.descricao");

            foreach(var f in fields)
            {
                if(f.Key == orderby) { orderby = f.Value; }
            }

            return dbContext.Database.Page<Models.QuerySalasReserva>(p, itensPerPage, new Sql(string.Format(@"SELECT 
	                                                                        R.*, 
	                                                                        S.descricao as 'SalaDescricao',
	                                                                        M.LoginName as 'Login',
	                                                                        M.Email  as 'Email'
                                                                        FROM [dbo].[sisSalasReserva] R 
                                                                        INNER JOIN [dbo].[sisSalas] S ON S.Id = R.salaId
                                                                        INNER JOIN [dbo].[cmsMember] M ON M.nodeId = R.memberId
            WHERE M.LoginName like '%{2}%' AND (R.StatusSalaReserva = '{3}' OR '{3}' = '') 
            ORDER BY {0} {1}", orderby ?? "R.Id", direction ?? "", login ?? "", status)));
        }
        public IEnumerable<Models.QuerySalasReserva> ListarPorResponsavel(int MemberId)
        {
            return dbContext.Database.Fetch<Models.QuerySalasReserva>(new Sql(@"SELECT 
	                                                                        R.*, 
	                                                                        S.descricao as 'SalaDescricao',
	                                                                        M.LoginName as 'Login',
	                                                                        M.Email  as 'Email'
                                                                        FROM [dbo].[sisSalasReserva] R 
                                                                        INNER JOIN [dbo].[sisSalas] S ON S.Id = R.salaId
                                                                        INNER JOIN [dbo].[cmsMember] M ON M.nodeId = R.memberId
                                                                        WHERE R.memberId = @0", MemberId)).AsEnumerable();
        }
        public IEnumerable<Models.QuerySalasReserva> ListarPorPeriodo(DateTime de, DateTime ate, int SalaId, StatusSalaReserva[] statusSalaReserva)
        {
            return dbContext.Database.Fetch<Models.QuerySalasReserva>(new Sql(@"SELECT 
	                                                                        R.*, 
	                                                                        S.descricao as 'SalaDescricao',
	                                                                        M.LoginName as 'Login',
	                                                                        M.Email  as 'Email'
                                                                        FROM [dbo].[sisSalasReserva] R 
                                                                        INNER JOIN [dbo].[sisSalas] S ON S.Id = R.salaId
                                                                        INNER JOIN [dbo].[cmsMember] M ON M.nodeId = R.memberId
                                                                        WHERE ((R.ReservaDe <= @1) AND (R.ReservaAte >= @0)) AND
                                                                        R.StatusSalaReserva IN(@2) AND R.SalaId = @3", de, ate, statusSalaReserva, SalaId)).AsEnumerable();
        }
        public IEnumerable<Models.QuerySalasReserva> ListarPorMes(int mes, int ano, int[] status)
        {
            return dbContext.Database.Fetch<Models.QuerySalasReserva>(new Sql(@"SELECT 
	                                                                        R.*, 
	                                                                        S.descricao as 'SalaDescricao',
	                                                                        M.LoginName as 'Login',
	                                                                        M.Email  as 'Email'
                                                                        FROM [dbo].[sisSalasReserva] R 
                                                                        INNER JOIN [dbo].[sisSalas] S ON S.Id = R.salaId
                                                                        INNER JOIN [dbo].[cmsMember] M ON M.nodeId = R.memberId
                                                                        WHERE 
                                                                            ((Year(R.ReservaDe) = @0 and Month(R.ReservaDe) = @1) OR 
                                                                            (Year(R.ReservaAte) = @0 and Month(R.ReservaAte) = @1)) AND
                                                                        R.StatusSalaReserva IN(@2)", ano, mes, status)).AsEnumerable();
        }
        public IEnumerable<Models.QuerySalasReserva> ListarPorSala(int id)
        {
            return dbContext.Database.Fetch<Models.QuerySalasReserva>(new Sql(@"SELECT 
	                                                                        R.*, 
	                                                                        S.descricao as 'SalaDescricao',
	                                                                        M.LoginName as 'Login',
	                                                                        M.Email  as 'Email'
                                                                        FROM [dbo].[sisSalasReserva] R 
                                                                        INNER JOIN [dbo].[sisSalas] S ON S.Id = R.salaId
                                                                        INNER JOIN [dbo].[cmsMember] M ON M.nodeId = R.memberId
                                                                        WHERE R.SalaId = @0", id)).AsEnumerable();
        }

        public Page<Models.QuerySalasReserva> ListarReservas(Paginacao<PesquisaSalaFilter> pag)
        {
            var sql = new Sql(@"SELECT 
                R.*, 
                S.descricao as 'SalaDescricao',
                M.LoginName as 'Login',
                M.Email  as 'Email'
                FROM [dbo].[sisSalasReserva] R 
                INNER JOIN [dbo].[sisSalas] S ON S.Id = R.salaId
                INNER JOIN [dbo].[cmsMember] M ON M.nodeId = R.memberId
                WHERE 
                    ((@0 is null) OR R.Id = @0) AND 
                    ((@1 is null) OR S.descricao like @1) AND 
                    ((@2 is null) OR R.StatusSalaReserva = @2) AND
                    ((@3 is null) OR R.tipoReserva = @3) AND
                    ((@4 is null) OR R.reservaDe >= @4) AND
                    ((@5 is null) OR R.reservaAte <= @5)AND
                    ((@6 is null) OR R.memberId = @6)AND
                    ((@7 is null) OR M.LoginName like @7)AND
                    ((@8 is null) OR R.servicoCopa = @8)AND
                    ((@9 is null) OR R.alimentacao like @9)AND
                    ((@10 is null) OR R.bebidas like @10)",
                        pag.filter.Id,
                        pag.filter.sala == null ? null : ("%" + pag.filter.sala + "%"), 
                        pag.filter.StatusSalaReserva, 
                        pag.filter.tipo,
                        pag.filter.ReservaDe,
                        pag.filter.ReservaAte, 
                        pag.filter.MemberId,
                        pag.filter.Login == null ? null : ("%" + pag.filter.Login + "%"),
                        pag.filter.ServicoCopa,
                        pag.filter.Alimentacao == null ? null : ("%" + pag.filter.Alimentacao + "%"),
                        pag.filter.Bebidas == null ? null : ("%" + pag.filter.Bebidas + "%")
                    );

            if (pag.orderDirection == 1)
                sql.OrderByDescending(pag.orderBy);
            else
                sql.OrderBy(pag.orderBy);

            return dbContext.Database.Page<Models.QuerySalasReserva>(pag.currentPage, pag.pageSize, sql);
        }

        public Page<Models.QuerySalasReserva> ListarReservasInadimplentes(Paginacao<PesquisaSalaFilter> pag)
        {
            var sql = new Sql(@"SELECT 
                R.*, 
                S.descricao as 'SalaDescricao',
                M.LoginName as 'Login',
                M.Email  as 'Email'
                FROM [dbo].[sisSalasReserva] R 
                INNER JOIN [dbo].[sisSalas] S ON S.Id = R.salaId
                INNER JOIN [dbo].[cmsMember] M ON M.nodeId = R.memberId
                WHERE 
                    ((@0 is null) OR R.Id = @0) AND 
                    ((@1 is null) OR S.descricao like @1) AND 
                    ((@2 is null) OR R.tipoReserva = @2) AND
                    ((@3 is null) OR R.reservaDe >= @3) AND
                    ((@4 is null) OR R.reservaAte <= @4)AND
                    ((@5 is null) OR R.memberId = @5)AND
                    ((@6 is null) OR M.LoginName like @6) AND R.StatusSalaReserva = @7",
                        pag.filter.Id,
                        pag.filter.sala == null ? null : ("%" + pag.filter.sala + "%"),
                        pag.filter.tipo,
                        pag.filter.ReservaDe,
                        DateTime.Today,
                        pag.filter.MemberId,
                        pag.filter.Login == null ? null : ("%" + pag.filter.Login + "%"),
                        StatusSalaReserva.ANDAMENTO
                    );

            if (pag.orderDirection == 1)
                sql.OrderByDescending(pag.orderBy);
            else
                sql.OrderBy(pag.orderBy);

            return dbContext.Database.Page<Models.QuerySalasReserva>(pag.currentPage, pag.pageSize, sql);
        }
    }
}