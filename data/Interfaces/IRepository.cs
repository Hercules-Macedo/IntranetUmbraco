using System.Collections.Generic;

namespace Intranet.data.Interfaces
{
    public interface IRepository<T>
    {
        IEnumerable<T> All();
        T Find( int Id );

        void Save(T obj);
        int Delete(T obj);
    }
}
