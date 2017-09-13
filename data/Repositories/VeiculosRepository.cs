using Intranet.Controllers.Base;
using Intranet.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Umbraco.Core.Persistence;

namespace Intranet.data.Repositories
{ 
    public class VeiculosRepository : Base.BaseRepository<Veiculo>, Interfaces.IRepository<Veiculo>
    {

        public IEnumerable<Models.QueryVeiculos> ListarVeiculos()
        {
            return dbContext.Database
                .Fetch<Models.QueryVeiculos>(new Sql("SELECT * FROM sisVeiculos ORDER BY modelo ASC"))
                .AsEnumerable();
        }

        public IEnumerable<Veiculo> All()
        {
            return dbContext.Database.Page<Veiculo>(1, 999, new Sql("SELECT * FROM sisVeiculos ORDER BY Id Desc")).Items.AsEnumerable();
        }
    }

    public class VeiculosReservaRepository : Base.BaseRepository<VeiculoReserva>, Interfaces.IRepository<VeiculoReserva>
    {

        public IEnumerable<Models.QueryVeiculoReservas> ListarPorMes(int mes, int ano, int[] status)
        {
            var sql = new Sql(@"SELECT   
                             V.[Id] VeiculoId
                            ,V.[marca]
                            ,V.[modelo]
                            ,V.[cor]
                            ,V.[ano]
                            ,V.[categoria]
                            ,V.[placa]
                            ,V.[chassi]
                            ,V.[combustivel]
                            ,V.[km]
                            ,V.[statusVeiculo]
                            ,V.[dataCadastro]
                            ,R.[Id] ReservaId
                            ,R.[memberId]
                            ,R.[reservaDe]
                            ,R.[reservaAte]
                            ,R.[kmRetirada]
                            ,R.[kmDevolucao]
                            ,R.[centroDeCustos]
                            ,R.[dataReserva]
                            ,R.[_motivoReserva]
                            ,R.[dataCancelamento]
                            ,R.[_motivoCancelamento]
                            ,R.[statusReserva]
                            ,M.Email
                            ,M.LoginName
                            FROM [dbo].[sisVeiculos] V
                            INNER JOIN [dbo].[sisVeiculosReservas] R ON V.Id = R.VeiculoId
                            INNER JOIN [dbo].[cmsMember] M ON M.nodeId = R.memberId
                        WHERE 
                            ((Year(R.ReservaDe) = @0 and Month(R.ReservaDe) = @1) OR 
                            (Year(R.ReservaAte) = @0 and Month(R.ReservaAte) = @1)) AND
                            R.statusReserva IN(@2)", ano, mes, status);

            return dbContext.Database.Fetch<Models.QueryVeiculoReservas>(sql).AsEnumerable();

        }

        public Page<QueryVeiculoReservas> ListarReservas(Paginacao<QueryVeiculoReservas> pag)
        {
            var sql = new Sql(@"SELECT   
                             V.[Id] VeiculoId
                            ,V.[marca]
                            ,V.[modelo]
                            ,V.[cor]
                            ,V.[ano]
                            ,V.[categoria]
                            ,V.[placa]
                            ,V.[chassi]
                            ,V.[combustivel]
                            ,V.[km]
                            ,V.[statusVeiculo]
                            ,V.[dataCadastro]
                            ,R.[Id] ReservaId
                            ,R.[memberId]
                            ,R.[reservaDe]
                            ,R.[reservaAte]
                            ,R.[kmRetirada]
                            ,R.[kmDevolucao]
                            ,R.[centroDeCustos]
                            ,R.[dataReserva]
                            ,R.[_motivoReserva]
                            ,R.[dataCancelamento]
                            ,R.[_motivoCancelamento]
                            ,R.[statusReserva]
                            ,M.Email
                            ,M.LoginName
                            FROM [dbo].[sisVeiculos] V
                            INNER JOIN [dbo].[sisVeiculosReservas] R ON V.Id = R.VeiculoId
                            INNER JOIN [dbo].[cmsMember] M ON M.nodeId = R.memberId
                        WHERE 
                            ((@0 is null) OR R.reservaDe >= @0) AND 
                            ((@1 is null) OR R.reservaAte <= @1) AND 
                            ((@2 is null) OR R.statusReserva = @2) AND
                            ((@3 is null) OR V.modelo LIKE @3) AND
                            ((@4 is null) OR V.marca LIKE @4) AND
                            ((@5 is null) OR R.Id = @5) AND
                            ((@6 is null) OR V.placa LIKE @6) AND
                            ((@7 is null) OR R.memberId = @7) AND
                            ((@8 is null) OR M.LoginName LIKE @8) AND
                            ((@9 is null) OR M.Email LIKE @9) AND
                            ((@10 is null) OR R.statusReserva <> @10)",
                                pag.filter.reservaDe,
                                pag.filter.reservaAte,
                                pag.filter.statusReserva,
                                pag.filter.modelo != null ? String.Format("%{0}%", pag.filter.modelo) : null,
                                pag.filter.marca != null ? String.Format("%{0}%", pag.filter.marca) : null,
                                pag.filter.ReservaId,
                                pag.filter.placa != null ? String.Format("%{0}%", pag.filter.placa) : null,
                                pag.filter.memberId,
                                pag.filter.LoginName != null ? String.Format("%{0}%", pag.filter.LoginName) : null,
                                pag.filter.Email != null ? String.Format("%{0}%", pag.filter.Email) : null,
                                (pag.filter.statusReserva == null ? (int?)StatusVeiculoReserva.CANCELADO : null)
            );

            if (pag.orderDirection == 1)
                sql.OrderByDescending(pag.orderBy);
            else
                sql.OrderBy(pag.orderBy);

            return dbContext.Database.Page<QueryVeiculoReservas>(pag.currentPage, pag.pageSize, sql);
        }

        public Page<QueryVeiculoManutencao> ListarManutencao(Paginacao<QueryVeiculoManutencao> pag)
        {
            var sql = new Sql(@"SELECT M.[Id] AS Id
                              ,[responsavelId]
                              ,[descricao]
                              ,[notaFiscal]
                              ,[valor]
                              ,[dataManutencao]
	                          ,V.[Id] AS VeiculoId
                              ,V.[marca]
                              ,V.[modelo]
                              ,V.[cor]
                              ,V.[ano]
                              ,V.[categoria]
                              ,V.[placa]
                              ,V.[chassi]
                              ,V.[combustivel]
                              ,V.[statusVeiculo]
                              ,V.[dataCadastro]
                              ,Me.Email
                              ,Me.LoginName
                          FROM [dbo].[sisVeiculosManutencao] M
                          INNER JOIN [dbo].[sisVeiculos] V ON V.Id = M.veiculoId
                          INNER JOIN [dbo].[cmsMember] Me ON Me.nodeId = M.responsavelId
                        WHERE 
                            ((@0 is null) OR V.modelo LIKE @0) AND
                            ((@1 is null) OR V.marca LIKE @1) AND
                            ((@2 is null) OR V.placa LIKE @2) AND
                            ((@3 is null) OR M.notaFiscal LIKE @3) AND
                            ((@4 = 0) OR M.valor = @4) AND
                            ((@5 is null) OR Me.LoginName = @5) AND
                            ((@6 is null) OR M.Id = @6)",
                                pag.filter.modelo != null ? String.Format("%{0}%", pag.filter.modelo) : null,
                                pag.filter.marca != null ? String.Format("%{0}%", pag.filter.marca) : null,
                                pag.filter.placa != null ? String.Format("%{0}%", pag.filter.placa) : null,
                                pag.filter.notaFiscal != null ? String.Format("%{0}%", pag.filter.notaFiscal) : null,
                                pag.filter.valor,
                                pag.filter.LoginName,
                                pag.filter.Id
                            );

            if (pag.orderDirection == 1)
                sql.OrderByDescending(pag.orderBy);
            else
                sql.OrderBy(pag.orderBy);

            return dbContext.Database.Page<QueryVeiculoManutencao>(pag.currentPage, pag.pageSize, sql);
        }

        public VeiculoReserva PorId(int id)
        {
            var reserva = dbContext.Database.Fetch<VeiculoReserva>("SELECT * FROM [dbo].[sisVeiculosReservas] WHERE Id = @0", id).FirstOrDefault();
            return reserva;
        }

        public IEnumerable<VeiculoReserva> All()
        {
            return dbContext.Database.Query<VeiculoReserva>(new Sql("SELECT * FROM sisVeiculosReservas")).AsEnumerable();
        }

        public IEnumerable<VeiculoReserva> MinhasReservas(int memberId)
        {
            var reservas = dbContext.Database.Fetch<VeiculoReserva>(new Sql("SELECT * FROM sisVeiculosReservas where memberId = @0", memberId)).AsEnumerable();
            return FillDependencies( reservas );
        }

        public IEnumerable<VeiculoReserva> MinhasReservasPorStatus(int memberId, StatusVeiculoReserva status)
        {
            var reservas = dbContext.Database.Fetch<VeiculoReserva>(new Sql("SELECT * FROM sisVeiculosReservas where memberId = @0 AND statusReserva = @1", memberId, (int)status)).AsEnumerable();
            return FillDependencies(reservas);
        }

        public ReturnData<VeiculoReserva> ReservaPaginada(Paginacao pag, VeiculoReserva filtro)
        {

            Sql sql = new Sql("WHERE 1 = 1");

            if (filtro.MemberId != 0)
                sql.Append("AND memberId = @0", filtro.MemberId);

            if (filtro.VeiculoId != 0)
                sql.Append("AND veiculoId = @0", filtro.VeiculoId);

            if (filtro.DataReserva != DateTime.MinValue)
                sql.Append("AND dataReserva = @0", filtro.DataReserva);

            if (filtro.ReservaDe != DateTime.MinValue)
                sql.Append("AND (YEAR(reservaDe)=@0 AND MONTH(reservaDe)=@1 AND DAY(reservaDe)=@2)", filtro.ReservaDe.Year, filtro.ReservaDe.Month, filtro.ReservaDe.Day);

           if (filtro.ReservaAte != DateTime.MinValue)
                sql.Append("AND reservaAte = @0", filtro.ReservaAte);

            if (filtro._storeStatusReserva != -1)
                sql.Append("AND statusReserva = @0", filtro._storeStatusReserva);

            sql.Append(String.Format("ORDER BY {0} {1}", (String.IsNullOrWhiteSpace(pag.orderBy) ? "Id" : pag.orderBy), (pag.orderDirection == 1 ? "DESC" : "ASC") ));

            var data = dbContext.Database.Page<VeiculoReserva>(pag.pageIndex, pag.pageSize, sql);
            pag.totalRecords = data.TotalItems;
            pag.totalPages = data.TotalPages;

            data.Items = FillDependencies(data.Items.AsEnumerable()).ToList();

            return new ReturnData<VeiculoReserva> { pag=pag, data=data.Items.AsEnumerable() };
        }

        public IEnumerable<VeiculoReserva> ReservasPorStatus(StatusVeiculoReserva status)
        {
            return dbContext.Database.Fetch<VeiculoReserva>(new Sql("SELECT * FROM sisVeiculosReservas WHERE statusReserva = @0", (int)status)).AsEnumerable();
        }

        public IEnumerable<Veiculo> VeiculosReservadosPorData(DateTime de, DateTime ate)
        {
            return dbContext.Database.Query<Veiculo>(new Sql(
                @"SELECT V.* FROM sisVeiculosReservas R
                    INNER JOIN sisVeiculos V ON V.Id = R.veiculoId
                    WHERE (R.reservaDe <= @0) and (@1 <= R.reservaAte)", ate, de)).AsEnumerable();
        }

        public IEnumerable<VeiculoReserva> VeiculosReservadosPorData(DateTime de, DateTime ate, int veiculoId)
        {
            return dbContext.Database.Query<VeiculoReserva>(new Sql(
                @"SELECT R.* FROM sisVeiculosReservas R
                    INNER JOIN sisVeiculos V ON V.Id = R.veiculoId
                    WHERE (R.reservaDe <= @0) and (@1 <= R.reservaAte) AND R.veiculoId = @2 AND statusReserva = @3", ate, de, veiculoId, StatusVeiculoReserva.CONFIRMADO)).AsEnumerable();
        }

        public IEnumerable<Veiculo> VeiculosDisponiveis(DateTime de, DateTime ate)
        {
            return dbContext.Database.Query<Veiculo>(new Sql(
               @"SELECT * FROM sisVeiculos WHERE Id not In(
	                SELECT V.Id FROM sisVeiculosReservas R
	                INNER JOIN sisVeiculos V ON V.Id = R.veiculoId
	                WHERE (R.reservaDe <= @0) and (@1 <= R.reservaAte) AND
                        statusReserva = @2
                )", ate, de, StatusVeiculoReserva.CONFIRMADO)).AsEnumerable();
        }

        public IEnumerable<VeiculoReserva> FillDependencies(IEnumerable<VeiculoReserva> reservas)
        {
            foreach(VeiculoReserva r in reservas)
            {
                var veiculo = dbContext.Database.Single<Veiculo>(r.VeiculoId);
                r.Veiculo = veiculo;

                var member = dbContext.Database.Single<MemberDto>(r.MemberId);
                r.Member = member;
            }
            return reservas;
        }
    }


}