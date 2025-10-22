import {
    Document,
    Text,
    Page,
    StyleSheet,
    Image,
    View,
  } from "@react-pdf/renderer";
import useFormatterNumber from "../hooks/useFormatterNumber";
import logo from '../assets/icons/logo.png';

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

function PDFstructure({ci,credito,name,fecha,quotes,user_auth}) {
    return (
      <Document>
        <Page style={styles.page}>
        
          <View style={styles.sectionHeader}>
            <Image style={styles.logo} src={logo}/>

            {/* DATOS DE LA EMPRESA */}
            <View style={styles.sectionHeaderRuc}>
                <Text style={[{fontSize:15,textAlign:"right"}]}>CONVENIO DE PAGO</Text>
                <View style={[{backgroundColor:'#CBE8EC',padding:5}]}>
                    <Text style={[{fontSize:9,marginBottom:10,color:'#178DAB',fontWeight:"bold"}]}>SERVICIOS DE ADMINISTRACIÓN INTEGRAL SEFIL S.A.</Text>
                    <View>
                    <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>RUC: 1792679443001</Text>
                    <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>FECHA Y HORA: {fecha}</Text>
                    {/* <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>{(localStorage.getItem('permission').includes('User:minimize')) ? "AUTORIZADO POR:" : "SOLICITADO POR" } {user_auth.toUpperCase()}</Text> */}
                    </View>
                </View>
                </View>
            </View>
        
            {/* DATOS DEL CLIENTE */}
            <View style={[{marginTop:20,width:'100%'}]}>
                <View style={{display:'flex',flexDirection:'row',width:'35%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>Sr (a):</Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>{name.toUpperCase()}</Text>
                </View>
                <View style={{display:'flex',flexDirection:'row',width:'35%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>C.I.:</Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>{ci}</Text>
                </View>
                <View style={{display:'flex',flexDirection:'row',width:'35%',justifyContent:'space-between'}}>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>CRÉDITO:</Text>
                <Text style={[{fontSize:7,marginBottom:7,fontWeight:800}]}>{credito}</Text>
                </View>
            </View>

            {/* DETALLE */}
            <View style={{width:'60%',border:'1px solid black'}}>
                <View style={{width:'100%',backgroundColor:"#C6EFCE",display:'flex',justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
                    <Text style={{width:'40%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>NRO. CUOTA</Text>
                    <Text style={{width:'30%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>VALOR CUOTA</Text>
                    <Text style={{width:'30%',fontSize:8,padding:5,textAlign:"center"}}>FECHA DE PAGO</Text>
                </View>
                {
                    quotes.map((cuota, index) => (
                        <View key={index} style={{width:'100%',display:'flex',flexDirection:'row'}}>
                            <Text style={{width:'40%',borderRight:'1px solid black',borderTop:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>
                                {cuota.cuota}
                            </Text>
                            <Text style={{width:'30%',borderRight:'1px solid black',borderTop:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>
                                ${cuota.valor}
                            </Text>
                            <Text style={{width:'30%',borderTop:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>
                                {cuota.fecha_pago}
                            </Text>
                        </View>
                    ))
                }
          </View>

          <View style={{marginTop:'50px',width:'100%',display:'flex',justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
            <View style={{width:'50%',padding:5,fontSize:8,textAlign:"center"}}>
              <Text>SOLICITADO POR:</Text>
              <Text>GESTOR. {user_auth.toUpperCase()}</Text>
            </View>
            <View style={{width:'50%',padding:5,fontSize:8,textAlign:"center"}}>
              <Text>AUTORIZADO POR:</Text>
              <Text>GERENTE. MARIA ELENA BRAVO</Text>
            </View>
          </View>

        </Page>
      </Document>
    );
  }
  
  export default PDFstructure;
