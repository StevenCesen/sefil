import {
    Document,
    Text,
    Page,
    StyleSheet,
    Image,
    View,
  } from "@react-pdf/renderer";


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
      paddingLeft:50,
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
        marginRight:50,
        width:"20%"
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
                GASTOS DE COBRANZA
              </Text>
              <Image style={styles.image} src={"./icons/logo.png"}/>
            </View>

            <View style={[styles.sectionDates,{paddingTop:20}]} >
              <Text style={styles.voucherText}>
                Nombre:
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

        
            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Gastos de cobranza
              </Text>
              <Text style={styles.voucherText}>
                $ {valor_gasto}
              </Text>
            </View>
        
          </View>

  
          <View style={{padding:20}}>
            <View style={styles.section}>
              <Text style={styles.title}>
                GASTOS DE COBRANZA
              </Text>
              <Image style={styles.image} src={"./icons/logo.png"}/>
            </View>

            <View style={[styles.sectionDates,{paddingTop:20}]}>
              <Text style={styles.voucherText}>
                Nombre:
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

            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Gastos de cobranza
              </Text>
              <Text style={styles.voucherText}>
                {valor_gasto}
              </Text>
            </View>
        
          </View>

        </Page>
      </Document>
    );
  }
  
  export default PDFgastos;
  