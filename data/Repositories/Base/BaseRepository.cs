using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using Umbraco.Core;
using Umbraco.Core.Logging;
using Umbraco.Core.Persistence;

namespace Intranet.data.Repositories.Base
{
    public class BaseRepository<T>
    {
        public DatabaseSchemaHelper helper;
        public DatabaseContext dbContext;
        public ILogger logger;

        public BaseRepository()
        {
            this.logger = LoggerResolver.Current.Logger;
            this.dbContext = ApplicationContext.Current.DatabaseContext;
            this.helper = new DatabaseSchemaHelper(dbContext.Database, logger, dbContext.SqlSyntax);
        }

        public int Delete(T obj)
        {
            return dbContext.Database.Delete(obj);
        }

        public T Find(int Id)
        {
            return dbContext.Database.SingleOrDefault<T>(Id);
        }

        public void Save(T obj)
        {
            dbContext.Database.Save(obj);
        }

//        public string BuildWhere(T filtro)
//        {
//            /*
//             var id=123;

//var sql=PetaPoco.Sql.Builder

//    .Append("SELECT * FROM articles")

//    .Append("WHERE article_id=@0", id);



//if (start_date.HasValue)

//    sql.Append("AND date_created>=@0", start_date.Value);



//if (end_date.HasValue)

//    sql.Append("AND date_created<=@0", end_date.Value);
//var a=db.Query<article>(sql)
//             */

            

//            PropertyInfo[] properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

//            foreach (PropertyInfo p in properties)
//            {
//                // Only work with strings
//                if (p.PropertyType != typeof(string)) {
//                    continue;
//                }

//                // If not writable then cannot null it; if not readable then cannot check it's value
//                if (!p.CanWrite || !p.CanRead) { continue; }

//                MethodInfo mget = p.GetGetMethod(false);
//                MethodInfo mset = p.GetSetMethod(false);

//                // Get and set methods have to be public
//                if (mget == null) { continue; }
//                if (mset == null) { continue; }

//                //foreach (T item in list)
//                //{
//                //    if (string.IsNullOrEmpty((string)p.GetValue(item, null)))
//                //    {
//                //        p.SetValue(item, replacement, null);
//                //    }
//                //}
//            }

//            return string.Empty;
//        }

    }

    public class Page<T> {
        public int page { get; set; }
        public int ItensPerPage { get; set; }
        public int total { get; set; }
        public IEnumerable<T> Itens { get; set; }
    }
}