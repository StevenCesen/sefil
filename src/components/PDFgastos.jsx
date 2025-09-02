import {
    Document,
    Text,
    Page,
    StyleSheet,
    Image,
    View,
  } from "@react-pdf/renderer";
import useFormatterNumber from "../hooks/useFormatterNumber";
import logo2 from '../assets/icons/logo.png';

  const styles = StyleSheet.create({
    page: {
      width:'100%',
      padding:15
    },
    sectionHeader:{
      width:'100%',
      display:'flex',
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      gap:10
    },
    sectionHeaderFac:{
      width:'35%',
      paddingTop:15,
      alignSelf:'flex-start'
    },
    bold:{
      fontWeight:'bold'
    },
    spacePadding:10,
    sectionHeaderRuc:{
      width:'45%',
    },
    logo:{
      width:'20%',
      border:'1px solid grey'
    },
    sectionHeaderDiv:{
      width:'100%',
      display:'flex',
      flexDirection:'row',
      justifyContent:"space-between"
    }
    
  });
  
  function PDFgastos({nro_voucher,credito,name,ci,direccion,fecha,clave_acceso,valor_gasto}) {
    return (
      <Document>
        <Page style={styles.page}>
        
          <View style={styles.sectionHeader}>
            <Image style={styles.logo} src={logo2}/>

            {/* DATOS DE LA AUTORIZACIÓN DE FACTURA */}
            <View style={styles.sectionHeaderFac}>
              <View style={styles.sectionHeaderDiv}>
                <Text style={[{fontSize:7,marginBottom:7}]}>AMBIENTE: PRODUCCIÓN</Text>
                <Text style={[{fontSize:7,marginBottom:7}]}>TIPO DE EMISIÓN: NORMAL</Text>
              </View>

              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>NÚMERO DE AUTORIZACIÓN SRI:</Text>
              <Text style={[{fontSize:7,marginBottom:7}]}>{clave_acceso}</Text>

              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>FECHA Y HORA DE AUTORIZACIÓN:</Text>
              <Text style={[{fontSize:7,marginBottom:7}]}>{fecha}</Text>
            </View>

            {/* DATOS DE LA EMPRESA */}
            <View style={styles.sectionHeaderRuc}>
              <Text style={[{fontSize:15,textAlign:"right"}]}>FACTURA ELECTRÓNICA {clave_acceso.substring(24,27)}-{clave_acceso.substring(28,30)}-{clave_acceso.substring(31,39)}</Text>
              <View style={[{backgroundColor:'#CBE8EC',padding:5}]}>
                <Text style={[{fontSize:9,marginBottom:10,color:'#178DAB',fontWeight:"bold"}]}>SERVICIOS DE ADMINISTRACIÓN INTEGRAL SEFIL S.A.</Text>
                <View>
                  <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>Matriz: SERGIO JATIVA N33-99 Y JOSE BOSMEDIANO</Text>
                  <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>Sucursal: SERGIO JATIVA N33-99 Y JOSE BOSMEDIANO</Text>
                  <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>RUC: 1792679443001</Text>
                  <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>Teléfonos: 022988500, 0992707503</Text>
                  <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>Email: </Text>
                  <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>Web: </Text>
                </View>
                <Text style={[{fontSize:8,textAlign:'right',marginTop:10,color:'#178DAB'}]}>OBLIGADO A LLEVAR CONTABILIDAD</Text>
                <Text style={[{fontSize:8,textAlign:'right',color:'#178DAB'}]}>CONTRIBUYENTE RÉGIMEN RIMPE</Text>
              </View>
            </View>
          </View>


          {/* DATOS DEL CLIENTE */}

          <View style={[{marginTop:20,width:'100%'}]}>
            <View style={{display:'flex',flexDirection:'row',width:'40%',justifyContent:'space-between'}}>
              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>Sr (a):</Text>
              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>{name}</Text>
            </View>
            <View style={{display:'flex',flexDirection:'row',width:'40%',justifyContent:'space-between'}}>
              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>R.U.C. / C.I.:</Text>
              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>{ci}</Text>
            </View>
            <View style={{display:'flex',flexDirection:'row',width:'40%',justifyContent:'space-between'}}>
              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>Fecha de emisión (a):</Text>
              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>{fecha.split(' ')[0]}</Text>
            </View>
            <View style={{display:'flex',flexDirection:'row',width:'40%',justifyContent:'space-between'}}>
              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>Dirección:</Text>
              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800,width:'50%',wordWrap:"break-word"}]}>{direccion}</Text>
            </View>
            <View style={{display:'flex',flexDirection:'row',width:'40%',justifyContent:'space-between'}}>
              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>Nota:</Text>
              <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>{"P/R. GESTIÓN DE COBRANZA"}</Text>
            </View>
          </View>

          {/* DETALLE */}

          <View style={{width:'100%',border:'1px solid black'}}>
            <Text style={{width:'100%',fontSize:8,textAlign:"center"}}>DETALLE</Text>
            <View style={{width:'100%',borderTop:'1px solid black',display:'flex',flexDirection:'row'}}>
              <Text style={{width:'10%',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}>CANTIDAD</Text>
              <Text style={{width:'50%',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}>DESCRIPCIÓN</Text>
              <Text style={{width:'20%',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}>PRECIO UNITARIO</Text>
              <Text style={{width:'20%',fontSize:8,textAlign:"center"}}>TOTAL $</Text>
            </View>
            <View style={{width:'100%',borderTop:'1px solid black',display:'flex',flexDirection:'row'}}>
              <Text style={{width:'10%',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}>1.00</Text>
              <Text style={{width:'50%',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}>GESTIÓN COBRANZA</Text>
              <Text style={{width:'20%',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}>{useFormatterNumber({value:Number(valor_gasto.substring(1))/1.15,currency:'USD'})}</Text>
              <Text style={{width:'20%',fontSize:8,textAlign:"center"}}>{useFormatterNumber({value:Number(valor_gasto.substring(1))/1.15,currency:'USD'})}</Text>
            </View>
          </View>

          {/* SUBTOTALES, IMPUESTOS Y TOTALES */}

          <View style={{width:'100%',display:'flex',flexDirection:'row',gap:10}}>

            {/* FORMA DE PAGO */}
            <View style={{width:'50%',marginTop:10}}>
              <Text style={{width:'100%',fontSize:8,borderTop:'1px solid black',borderLeft:'1px solid black',borderRight:'1px solid black',textAlign:"center"}}>PAGOS</Text>
              <View style={{width:'100%',borderTop:'1px solid black',display:'flex',flexDirection:'row'}}>
                <Text style={{width:'50%',borderLeft:'1px solid black',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}>Forma de pago</Text>
                <Text style={{width:'20%',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}>Valor</Text>
                <Text style={{width:'20%',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}>Plazo</Text>
                <Text style={{width:'10%',fontSize:8,textAlign:"center",borderRight:'1px solid black'}}>Tiempo</Text>
              </View>
              <View style={{width:'100%',borderTop:'1px solid black',borderBottom:'1px solid black',display:'flex',flexDirection:'row'}}>
                <Text style={{width:'50%',borderLeft:'1px solid black',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}>OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO</Text>
                <Text style={{width:'20%',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}>{valor_gasto.split('$')[1]}</Text>
                <Text style={{width:'20%',borderRight:'1px solid black',fontSize:8,textAlign:"center"}}></Text>
                <Text style={{width:'10%',fontSize:8,textAlign:"center",borderRight:'1px solid black'}}></Text>
              </View>
            </View>

            {/* VALORES */}
            <View style={{width:'50%',marginTop:10,paddingLeft:100}}>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>SUBTOTAL IVA 15%: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>{useFormatterNumber({value:Number(valor_gasto.substring(1))/1.15,currency:'USD'})}</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>SUBTOTAL IVA 5%: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>0.00</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>SUBTOTAL IVA DIFERENCIADO: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>0.00</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>SUBTOTAL 0%: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>0.00</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>SUBTOTAL NO OBJETO DE IVA: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>0.00</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>SUBTOTAL SIN IMPUESTOS: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>{useFormatterNumber({value:Number(valor_gasto.substring(1))/1.15,currency:'USD'})}</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>SUBTOTAL EXENTO DE IVA: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>0.00</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>DESCUENTO: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>0.00</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>ICE: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>0.00</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>IVA 15%: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>{useFormatterNumber({value:Number(valor_gasto.substring(1))-Number(valor_gasto.substring(1))/1.15,currency:'USD'})}</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>IVA 5%: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>0.00</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>IVA DIFERENCIADO: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>0.00</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>IRBPNR: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>0.00</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>PROPINA: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>0.00</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>VALOR TOTAL: </Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>{valor_gasto}</Text>
              </View>
            </View>

          </View>

          <View style={{width:'300px',position:'absolute',bottom:20}}>
            <Text style={[{fontSize:7,width:'100%',textAlign:'center'}]}>CLAVE DE ACCESO</Text>
            <Text style={[{fontSize:7,marginBottom:7,textAlign:"center"}]}>{clave_acceso}</Text>
            <Text style={[{fontSize:7,marginBottom:7,textAlign:"center"}]}>Consulte sus documentos electrónicos en: www.factel.com.ec</Text>
          </View>
        </Page>
      </Document>
    );
  }
  
  export default PDFgastos;
  