import {
    Document,
    Text,
    Page,
    StyleSheet,
    Image,
    View,
  } from "@react-pdf/renderer";
import useFormatterNumber from "../hooks/useFormatterNumber";


  const styles = StyleSheet.create({
    page: {
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"flex-start",
      backgroundColor: "white",
      position:'relative'
    },
    watermark:{
      position:'absolute',
      fontSize:30,
      color:'rgba(219, 219, 219, 0.514)',
      zIndex:0
    },
    title: {
      width:"100%",
      fontSize: 10,
      paddingLeft:40,
      wordWrap:"break-word",
      textAlign: "justify",
      fontWeight: "ultrabold",
    },
    section: {
      display: "flex",
      flexDirection: "row",
      alignItems:"center",
      width:"100%",
      padding: 0,
      marginTop:40,
    },
    sectionDates: {
      display: "flex",
      flexDirection: "row",
      justifyContent:"space-between",
      alignItems:"flex-start",
      width:"100%",
      //paddingLeft:50,
      paddingRight:30,
      fontSize:9,
      fontWeight:"100",
      marginBottom:5
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
    voucherNumber:{
      color:"red",
      width:"50%",
      fontSize:12,
      textAlign:"right",
      marginTop:20,
      marginBottom:5,
      paddingRight:40
    },
    voucherText:{
      marginRight:60,
      width:"80%"
    },
    voucherTextBold:{
      width:"50%",
      fontWeight:"900"
    },
    marginBottom:{
      marginBottom:10,
    },  
    sectionFooter:{
      display: "flex",
      flexDirection: "row",
      justifyContent:"flex-start",
      alignItems:"flex-start",
      width:"100%",
      fontSize:9,
      fontWeight:"100",
      paddingLeft:40,
      paddingRight:40,
    },
    nueva:{
      top:100
    },
    //Para mitad de hoja
    document_render:{
      width:"50%"
    },
    
    image:{
      width:"100px",
      marginRight:0
    }
  });
  
  function PDFgastos({nro_voucher,credito,name,ci,valor_gasto}) {
    return (
      <Document>
        <Page style={styles.page}>
        
          <View style={{padding:20,marginBottom:20}}>
            <View style={styles.section}>
              <Text style={styles.title}>
                FACTURA | Gastos Cobranza
              </Text>
              <Image style={styles.image} src={"./icons/logo.png"}/>
            </View>

          <View style={{border:'1px solid grey',marginLeft:40,padding:5,marginTop:10,borderRadius:5}}>

            <View style={[styles.sectionDates,{paddingTop:5}]} >
              <Text style={styles.voucherText}>
                RAZÓN SOCIAL:
              </Text>
              <Text style={[styles.voucherText,{width:'40%',paddingRight:10,paddingLeft:0,textAlign:'left'}]}>
                SERVICIOS DE ADMINISTRACION INTEGRAL SEFIL S.A.
              </Text>
            </View>

            <View style={[styles.sectionDates,{paddingTop:10}]} >
              <Text style={styles.voucherText}>
                RUC:
              </Text>
              <Text style={styles.voucherText}>
                1792679443001
              </Text>
            </View>

            <View style={[styles.sectionDates,{paddingTop:10}]} >
              <Text style={styles.voucherText}>
                NÚMERO DE AUTORIZACIÓN:
              </Text>
            </View>

            <View style={[styles.sectionDates,{paddingTop:5,paddingBottom:5}]}>
              <Text style={[styles.voucherText,{wordWrap:"break-word",fontSize:'7px'}]}>
                  2304202401115057533800120010010000000092776463011
              </Text>
            </View>

            <View style={[styles.sectionDates]} >
              <Text style={styles.voucherText}>
                FECHA Y HORA:
              </Text>
              <Text style={styles.voucherText}>
                2024/04/23 10:04:00
              </Text>
            </View>

            <View style={[styles.sectionDates]} >
              <Text style={styles.voucherText}>
                AMBIENTE:
              </Text>
              <Text style={styles.voucherText}>
                PRODUCCIÓN
              </Text>
            </View>
          </View>

          <View style={{border:'1px solid grey',marginLeft:40,padding:5,marginTop:5,borderRadius:5}}>
            <View style={[styles.sectionDates,{paddingTop:5}]} >
              <Text style={styles.voucherText}>
                Cliente:
              </Text>
              <Text style={styles.voucherText}>
                {name}
              </Text>
            </View>
            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}> 
                Cédula:
              </Text>
              <Text style={styles.voucherText}>
                {ci}
              </Text>
            </View>
            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}> 
                Crédito:
              </Text>
              <Text style={styles.voucherText}>
                {credito}
              </Text>
            </View>

          </View>

          
          <View style={{marginLeft:40,padding:5,marginTop:5,borderRadius:5}}>
            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                SUBTOTAL   :
              </Text>
              <Text style={[styles.voucherText,{textAlign:'center'}]}>
                {useFormatterNumber({value:Number(valor_gasto.substring(1))-Number(valor_gasto.substring(1))*0.15,currency:'USD'})}
              </Text>
            </View>
            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                IVA (15%)  :
              </Text>
              <Text style={[styles.voucherText,{textAlign:'center'}]}>
                {useFormatterNumber({value:Number(valor_gasto.substring(1))*0.15,currency:'USD'})}
              </Text>
            </View>
            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                VALOR TOTAL:
              </Text>
              <Text style={[styles.voucherText,{textAlign:'center'}]}>
                {valor_gasto}
              </Text>
            </View>
          </View>

        </View>

        <View style={{padding:20}}>

          <View style={styles.section}>
            <Text style={styles.title}>
              FACTURA | Gastos Cobranza
            </Text>
            <Image style={styles.image} src={"./icons/logo.png"}/>
          </View>

          <View style={{border:'1px solid grey',marginLeft:40,padding:5,marginTop:10,borderRadius:5}}>

            <View style={[styles.sectionDates,{paddingTop:5}]} >
              <Text style={styles.voucherText}>
                RAZÓN SOCIAL:
              </Text>
              <Text style={[styles.voucherText,{width:'40%',paddingRight:10,paddingLeft:0,textAlign:'left'}]}>
                SERVICIOS DE ADMINISTRACION INTEGRAL SEFIL S.A.
              </Text>
            </View>

            <View style={[styles.sectionDates,{paddingTop:10}]} >
              <Text style={styles.voucherText}>
                RUC:
              </Text>
              <Text style={styles.voucherText}>
                1792679443001
              </Text>
            </View>

            <View style={[styles.sectionDates,{paddingTop:10}]} >
              <Text style={styles.voucherText}>
                NÚMERO DE AUTORIZACIÓN:
              </Text>
            </View>

            <View style={[styles.sectionDates,{paddingTop:5,paddingBottom:5}]}>
              <Text style={[styles.voucherText,{wordWrap:"break-word",fontSize:'7px'}]}>
                  2304202401115057533800120010010000000092776463011
              </Text>
            </View>

            <View style={[styles.sectionDates]} >
              <Text style={styles.voucherText}>
                FECHA Y HORA:
              </Text>
              <Text style={styles.voucherText}>
                2024/04/23 10:04:00
              </Text>
            </View>
            
            <View style={[styles.sectionDates]} >
              <Text style={styles.voucherText}>
                AMBIENTE:
              </Text>
              <Text style={styles.voucherText}>
                PRODUCCIÓN
              </Text>
            </View>
          </View>

          <View style={{border:'1px solid grey',marginLeft:40,padding:5,marginTop:5,borderRadius:5}}>
            <View style={[styles.sectionDates,{paddingTop:5}]} >
              <Text style={styles.voucherText}>
                Cliente:
              </Text>
              <Text style={styles.voucherText}>
                {name}
              </Text>
            </View>
            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}> 
                Cédula:
              </Text>
              <Text style={styles.voucherText}>
                {ci}
              </Text>
            </View>
            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}> 
                Crédito:
              </Text>
              <Text style={styles.voucherText}>
                {credito}
              </Text>
            </View>

          </View>

          <View style={{marginLeft:40,padding:5,marginTop:5,borderRadius:5}}>
            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                SUBTOTAL   :
              </Text>
              <Text style={[styles.voucherText,{textAlign:'center'}]}>
                {useFormatterNumber({value:Number(valor_gasto.substring(1))-Number(valor_gasto.substring(1))*0.15,currency:'USD'})}
              </Text>
            </View>
            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                IVA (15%)  :
              </Text>
              <Text style={[styles.voucherText,{textAlign:'center'}]}>
                {useFormatterNumber({value:Number(valor_gasto.substring(1))*0.15,currency:'USD'})}
              </Text>
            </View>
            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                VALOR TOTAL:
              </Text>
              <Text style={[styles.voucherText,{textAlign:'center'}]}>
                {valor_gasto}
              </Text>
            </View>
          </View>

        </View>

        </Page>
      </Document>
    );
  }
  
  export default PDFgastos;
  