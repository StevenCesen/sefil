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
  
  function PDFcondonacion({ci,credito,name,fecha,prevDates,postDates,user_auth}) {
    return (
      <Document>
        <Page style={styles.page}>
        
          <View style={styles.sectionHeader}>
            <Image style={styles.logo} src={logo}/>

            {/* DATOS DE LA EMPRESA */}
            <View style={styles.sectionHeaderRuc}>
              <Text style={[{fontSize:15,textAlign:"right"}]}>CONDONACIÓN</Text>
              <View style={[{backgroundColor:'#CBE8EC',padding:5}]}>
                <Text style={[{fontSize:9,marginBottom:10,color:'#178DAB',fontWeight:"bold"}]}>SERVICIOS DE ADMINISTRACIÓN INTEGRAL SEFIL S.A.</Text>
                <View>
                  <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>RUC: 1792679443001</Text>
                  <Text style={[{fontSize:7,marginBottom:3,color:'#178DAB'}]}>FECHA Y HORA DE AUTORIZACIÓN: {fecha}</Text>
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
              <Text style={{width:'40%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>DESCRIPCIÓN</Text>
              <Text style={{width:'30%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>VALOR ORIGINAL</Text>
              <Text style={{width:'30%',fontSize:8,padding:5,textAlign:"center"}}>VALOR CONDONADO</Text>
            </View>
            <View style={{width:'100%',borderTop:'1px solid black',display:'flex',justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
              <Text style={{width:'40%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>Capital</Text>
              <Text style={{width:'30%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>{useFormatterNumber({value:JSON.parse(prevDates).capital,currency:'USD'})}</Text>
              <Text style={{width:'30%',fontSize:8,padding:5,textAlign:"center"}}>
                {
                    useFormatterNumber({value:Number(JSON.parse(prevDates).capital)-Number(JSON.parse(postDates).capital),currency:'USD'})
                }</Text>
            </View>
            <View style={{width:'100%',borderTop:'1px solid black',display:'flex',justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
              <Text style={{width:'40%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>Interés</Text>
              <Text style={{width:'30%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>{useFormatterNumber({value:JSON.parse(prevDates).interes,currency:'USD'})}</Text>
              <Text style={{width:'30%',fontSize:8,padding:5,textAlign:"center"}}>
                {
                    useFormatterNumber({value:Number(JSON.parse(prevDates).interes)-Number(JSON.parse(postDates).interes),currency:'USD'})
                }</Text>
            </View>
            <View style={{width:'100%',borderTop:'1px solid black',display:'flex',justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
              <Text style={{width:'40%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>Mora</Text>
              <Text style={{width:'30%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>{useFormatterNumber({value:JSON.parse(prevDates).mora,currency:'USD'})}</Text>
              <Text style={{width:'30%',fontSize:8,padding:5,textAlign:"center"}}>
                {
                    useFormatterNumber({value:Number(JSON.parse(prevDates).mora)-Number(JSON.parse(postDates).mora),currency:'USD'})
                }</Text>
            </View>
            <View style={{width:'100%',borderTop:'1px solid black',display:'flex',justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
              <Text style={{width:'40%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>Seguro desgravamen</Text>
              <Text style={{width:'30%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>{useFormatterNumber({value:JSON.parse(prevDates).seguro_desgravamen,currency:'USD'})}</Text>
              <Text style={{width:'30%',fontSize:8,padding:5,textAlign:"center"}}>
                {
                    useFormatterNumber({value:Number(JSON.parse(prevDates).seguro_desgravamen)-Number(JSON.parse(postDates).seguro_desgravamen),currency:'USD'})
                }</Text>
            </View>
            <View style={{width:'100%',borderTop:'1px solid black',display:'flex',justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
              <Text style={{width:'40%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>Gastos judiciales</Text>
              <Text style={{width:'30%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>{useFormatterNumber({value:JSON.parse(prevDates).gastos_judiciales,currency:'USD'})}</Text>
              <Text style={{width:'30%',fontSize:8,padding:5,textAlign:"center"}}>
                {
                    useFormatterNumber({value:Number(JSON.parse(prevDates).gastos_judiciales)-Number(JSON.parse(postDates).gastos_judiciales),currency:'USD'})
                }</Text>
            </View>
            <View style={{width:'100%',borderTop:'1px solid black',display:'flex',justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
              <Text style={{width:'40%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>Gastos cobranza</Text>
              <Text style={{width:'30%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>{useFormatterNumber({value:JSON.parse(prevDates).gastos_cobranza,currency:'USD'})}</Text>
              <Text style={{width:'30%',fontSize:8,padding:5,textAlign:"center"}}>
                {
                    useFormatterNumber({value:Number(JSON.parse(prevDates).gastos_cobranza)-Number(JSON.parse(postDates).gastos_cobranza),currency:'USD'})
                }</Text>
            </View>
            <View style={{width:'100%',borderTop:'1px solid black',display:'flex',justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
              <Text style={{width:'40%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>Otros valores</Text>
              <Text style={{width:'30%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>{useFormatterNumber({value:JSON.parse(prevDates).otros_valores,currency:'USD'})}</Text>
              <Text style={{width:'30%',fontSize:8,padding:5,textAlign:"center"}}>
                {
                    useFormatterNumber({value:Number(JSON.parse(prevDates).otros_valores)-Number(JSON.parse(postDates).otros_valores),currency:'USD'})
                }</Text>
            </View>
            <View style={{width:'100%',borderTop:'1px solid black',display:'flex',justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
              <Text style={{width:'40%',borderRight:'1px solid black',padding:5,fontSize:8,textAlign:"center"}}>TOTAL</Text>
              <Text style={{width:'30%',borderRight:'1px solid black',padding:5,textAlign:"center"}}>{}</Text>
              <Text style={{width:'30%',fontSize:8,padding:5,textAlign:"center"}}>
                {
                    (useFormatterNumber({value:Number(JSON.parse(prevDates).capital)-Number(JSON.parse(postDates).capital)+
                    Number(JSON.parse(prevDates).interes)-Number(JSON.parse(postDates).interes)+
                    Number(JSON.parse(prevDates).mora)-Number(JSON.parse(postDates).mora)+
                    Number(JSON.parse(prevDates).seguro_desgravamen)-Number(JSON.parse(postDates).seguro_desgravamen)+
                    Number(JSON.parse(prevDates).gastos_judiciales)-Number(JSON.parse(postDates).gastos_judiciales)+
                    Number(JSON.parse(prevDates).gastos_cobranza)-Number(JSON.parse(postDates).gastos_cobranza)+
                    Number(JSON.parse(prevDates).otros_valores)-Number(JSON.parse(postDates).otros_valores),currency:'USD'}))
                
                }</Text>
            </View>
          </View>

          <View style={{marginTop:'100px',width:'100%',display:'flex',justifyContent:"center",alignItems:"center",flexDirection:'row'}}>
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
  
  export default PDFcondonacion;
  