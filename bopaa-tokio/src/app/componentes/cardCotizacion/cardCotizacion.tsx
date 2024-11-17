import './cardCotizacion.ccs'



const cardCotizacion = ({ codEmpresa, nameEmpresa, valorActual, valorAnterior,porcentaje, fluctuacion }: any) => {
  return (
    <div className='cardCotizacion'>
      <div className="nombresEmpresa">
        <p className="nombre">${nameEmpresa}</p>
        <p className="codigo">${codEmpresa}</p>
      </div>
      <div className="informacion">
        <div className="flecha">

        </div>
        <div className="valor">
          <p className="valor">${valorActual}</p>
          <p className="porcetaje">${porcentaje}</p>
        </div>
      </div>
    </div>


  )

}

export default cardCotizacion;