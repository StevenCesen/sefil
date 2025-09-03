import {
    Document,
    Text,
    Page,
    StyleSheet,
    Image,
    View,
  } from "@react-pdf/renderer";
import useFormatterNumber from "../hooks/useFormatterNumber";
import logo3 from '../assets/icons/logo.png';

  const styles = StyleSheet.create({
    page: {
      width:'100%',
      padding:30
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
      width:'70%',
    },
    logo:{
      width:'30%',
      border:'1px solid grey'
    },
    sectionHeaderDiv:{
      width:'100%',
      display:'flex',
      flexDirection:'row',
      justifyContent:"space-between"
    }
    
  });
  
  function PDFreport({images,state_cartera,byMonth,byMora,activos,filters}) {
    return (
      <Document>
        <Page style={styles.page}>
        
          <View style={styles.sectionHeader}>
            <Image style={styles.logo} src={logo3}/>

            {/* DATOS DE LA EMPRESA */}
            <View style={styles.sectionHeaderRuc}>
              <Text style={[{fontSize:15,textAlign:"right"}]}>ESTADO DE CARTERA</Text>
              <View style={[{backgroundColor:'#CBE8EC',padding:5}]}>
                <Text style={[{fontSize:9,marginBottom:10,color:'#178DAB',fontWeight:"bold"}]}>SERVICIOS DE ADMINISTRACIÓN INTEGRAL SEFIL S.A.</Text>

                <View>
                  <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>RUC: 1792679443001</Text>
                  <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>FECHA Y HORA: {new Date().toLocaleDateString()}</Text>
                </View>

              </View>
            </View>
          </View>

          {console.log(byMora)}

          <View>
            <Text style={{color:"#009793",fontSize:16,marginTop:20}}>1) Valores a recuperar</Text>
            <View style={{border:"1px solid rgb(187, 187, 187)",borderRadius:'5px',padding:10,width:"50%"}}>
    
              <View>
                <Text style={{fontSize:12}}>Provincia: {(filters.provincia==="") ? "Todas" : filters.provincia}</Text>
              </View>
              <View>
                <Text style={{fontSize:12}}>Cantón: {(filters.canton==="") ? "Todas" : filters.canton}</Text>
              </View>
              <View>
                <Text style={{fontSize:12}}>Agencia: {(filters.agency==="") ? "Todas" : filters.agency}</Text>
              </View>
              <View>
                <Text style={{fontSize:12}}>Empresa: {(filters.empresa==="") ? "Todas" : filters.empresa}</Text>
              </View>
            </View>

            <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",marginTop:10,gap:10}}>

              <View style={{border:"1px solid rgb(187, 187, 187)",borderRadius:'5px',padding:10,width:"50%"}}>
                <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                  <Text style={{fontSize:12}}>Capital:</Text>
                  <Text style={{fontSize:12}}>{useFormatterNumber({value:state_cartera.saldo_capital,currency:'USD'})}</Text>
                </View>

                <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                  <Text style={{fontSize:12}}>Interés:</Text>
                  <Text style={{fontSize:12}}>{useFormatterNumber({value:state_cartera.interes,currency:'USD'})}</Text>
                </View>

                <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                  <Text style={{fontSize:12}}>Mora:</Text>
                  <Text style={{fontSize:12}}>{useFormatterNumber({value:state_cartera.mora,currency:'USD'})}</Text>
                </View>

                <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                  <Text style={{fontSize:12}}>Seguro desgravamen:</Text>
                  <Text style={{fontSize:12}}>{useFormatterNumber({value:state_cartera.seguro_desgravamen,currency:'USD'})}</Text>
                </View>

                <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                  <Text style={{fontSize:12}}>Gastos judiciales:</Text>
                  <Text style={{fontSize:12}}>{useFormatterNumber({value:state_cartera.gastos_judiciales,currency:'USD'})}</Text>
                </View>

                <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                  <Text style={{fontSize:12}}>Gastos de cobranza:</Text>
                  <Text style={{fontSize:12}}>{useFormatterNumber({value:state_cartera.gastos_cobranza,currency:'USD'})}</Text>
                </View>

                <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                  <Text style={{fontSize:12}}>Otros valores:</Text>
                  <Text style={{fontSize:12}}>{useFormatterNumber({value:state_cartera.otros_valores,currency:'USD'})}</Text>
                </View>

                <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                  <Text style={{fontSize:12}}>Total:</Text>
                  <Text style={{fontSize:12}}>{useFormatterNumber({value:state_cartera.totalAmount,currency:'USD'})}</Text>
                </View>
              </View>
              
              <View style={{border:"1px solid rgb(187, 187, 187)",borderRadius:'5px',padding:10,width:"50%"}}>
                <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                  <Text style={{fontSize:12}}>Créditos activos:</Text>
                  <Text style={{fontSize:12}}>{state_cartera.creditos_activos}</Text>
                </View>
                <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                  <Text style={{fontSize:12}}>Créditos inactivos:</Text>
                  <Text style={{fontSize:12}}>{state_cartera.creditos_inactivos}</Text>
                </View>
                <View style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                  <Text style={{fontSize:12}}>Total:</Text>
                  <Text style={{fontSize:12}}>{state_cartera.total_creditos}</Text>
                </View>
              </View>

            </View>
            
          </View>

          <View>
            <Text style={{color:"#009793",fontSize:16,marginTop:20}}>2) Estado de carteras</Text>
            <Image
              src={images[2]}
            />
          </View>

          <View>
            <Text style={{color:"#009793",fontSize:16,marginTop:20}}>3) Tendencia anual de recuperación: SEFIL 1</Text>
            <Image
              src={images[0]}
            />
          </View>

          <View>
            <Text style={{color:"#009793",fontSize:16,marginTop:60}}>4) Tendencia anual de recuperación: SEFIL 2</Text>
            <Image
              src={images[1]}
            />
          </View>

          <View>
            <Text style={{color:"#009793",fontSize:16,marginTop:20}}>5) Distribución de créditos activos por agencias</Text>
            <View style={{border:"1px solid rgb(187, 187, 187)",borderRadius:'5px',padding:10,width:"70%"}}>
              <View style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexDirection:"row",gap:10,marginBottom:10}}>
                <Text style={{fontSize:14,width:"50%",textAlign:"center"}}>Agencia</Text>
                <Text style={{fontSize:14,width:"15%",textAlign:"center"}}>Nro</Text>
                <Text style={{fontSize:14,width:"35%",textAlign:"center"}}>Monto adeudado</Text>
              </View>
              {
                activos.map((agencia)=>(
                  (agencia.cartera_actual.activos>0)
                  ?
                    <View style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                      <Text style={{fontSize:12,width:"50%"}}>{agencia.agency.toUpperCase()}</Text>
                      <Text style={{fontSize:12,width:"15%",textAlign:"center"}}>{agencia.cartera_actual.activos}</Text>
                      <Text style={{fontSize:12,width:"35%"}}>{useFormatterNumber({value:agencia.cartera_actual.monto,currency:'USD'})}</Text>
                    </View>
                  : <></>
                ))
              }
            </View>
          </View>

          <View>
            <Text style={{color:"#009793",fontSize:16,marginTop:20}}>6) Distribución de créditos por montos</Text>
            <View style={{border:"1px solid rgb(187, 187, 187)",borderRadius:'5px',padding:10,width:"70%"}}>
              <View style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexDirection:"row",gap:10,marginBottom:10}}>
                <Text style={{fontSize:14,width:"35%",textAlign:"center"}}>Rango</Text>
                <Text style={{fontSize:14,width:"30%",textAlign:"center"}}>Créditos</Text>
                <Text style={{fontSize:14,width:"35%",textAlign:"center"}}>Monto adeudado</Text>
              </View>
              {
                byMonth.map((month)=>(
                  
                  <View style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                    <Text style={{fontSize:12,width:"35%"}}>{month.rango}</Text>
                    <Text style={{fontSize:12,width:"30%",textAlign:"center"}}>{month.cantidad}</Text>
                    <Text style={{fontSize:12,width:"35%"}}>{useFormatterNumber({value:month.monto,currency:'USD'})}</Text>
                  </View>
                
                ))
              }
            </View>
          </View>

          <View>
            <Text style={{color:"#009793",fontSize:16,marginTop:20}}>7) Distribución de créditos por días mora</Text>
            <View style={{border:"1px solid rgb(187, 187, 187)",borderRadius:'5px',padding:10,width:"70%"}}>
              <View style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexDirection:"row",gap:10,marginBottom:10}}>
                <Text style={{fontSize:14,width:"35%",textAlign:"center"}}>Rango</Text>
                <Text style={{fontSize:14,width:"30%",textAlign:"center"}}>Créditos</Text>
                <Text style={{fontSize:14,width:"35%",textAlign:"center"}}>Monto adeudado</Text>
              </View>
              {
                byMora.map((mora)=>(
                  
                  <View style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexDirection:"row",gap:10}}>
                    <Text style={{fontSize:12,width:"35%"}}>{mora.rango}</Text>
                    <Text style={{fontSize:12,width:"30%",textAlign:"center"}}>{mora.cantidad}</Text>
                    <Text style={{fontSize:12,width:"35%"}}>{useFormatterNumber({value:mora.monto,currency:'USD'})}</Text>
                  </View>
                ))
              }
            </View>
          </View>

        </Page>
      </Document>
    );
  }
  
  export default PDFreport;