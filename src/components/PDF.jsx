import {
    Document,
    Text,
    Page,
    StyleSheet,
    Image,
    View,
  } from "@react-pdf/renderer";
  import logo from "/icons/logo.png";
  
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "white",
      padding: 30,
      position:'relative'
    },
    watermark:{
      position:'absolute',
      fontSize:50,
      color:'rgba(219, 219, 219, 0.514)',
      zIndex:0
    },
    title: {
        width:"100%",
        fontSize: 24,
      textAlign: "center",
      fontWeight: "ultrabold",
    },
    section: {
      display: "flex",
      flexDirection: "row",
      alignItems:"center",
      margin: 10,
      padding: 5,
    },
    sectionDates: {
        display: "flex",
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems:"center",
        margin: 10,
        fontSize:20,
        fontWeight:"100"
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
        width:"100%",
        fontSize:30,
        textAlign:"right",
        marginTop:10,
        marginBottom:10
    },
    voucherText:{
        width:"50%"
    },
    voucherTextBold:{
      width:"50%",
      fontWeight:"900"
    },
    marginBottom:{
        marginBottom:30,
    },  
    sectionFooter:{
        display: "flex",
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems:"center",
        marginLeft:10,
        fontSize:16,
        fontWeight:"100"
    },
    nueva:{
      top:100

    }
  });
  
  function PDF({nro_voucher,type_print,tipo_transaccion,forma_pago,insitucion_financiera,codigo_deposito,name,ci,mora,interes,seguro_desgravamen,gastos_judiciales,saldo_capital,gastos_cobranza,otros_valores,total,valor_recibido,valor_devuelto,fecha,agente}) {
    return (
      <Document>
        <Page style={styles.page}>
          <View style={[styles.watermark,{top:50,left:20}]}>
            <Text>{type_print}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>
              COMPROBANTE DE PAGO
            </Text>
            <Image src={logo} />
          </View>

            <View style={styles.voucherNumber}>
                <Text>No. {nro_voucher}</Text>
            </View>

          <View style={[styles.watermark,{top:120,left:300}]}>
            <Text>{type_print}</Text>
          </View>

          <View style={[styles.watermark,{top:250,left:20}]}>
            <Text>{type_print}</Text>
          </View>

          {
            (forma_pago!=='efectivo') &&
                <>
                    <View style={styles.sectionDates}>
                        <Text style={styles.voucherText}>
                        Institución financiera:
                        </Text>
                        <Text style={styles.voucherText}>
                            {insitucion_financiera}
                        </Text>
                    </View>
                    <View style={styles.sectionDates}>
                        <Text style={styles.voucherText}>
                        Código de depósito:
                        </Text>
                        <Text style={styles.voucherText}>
                            {codigo_deposito}
                        </Text>
                    </View>
                </>
          }
          <View style={[styles.watermark,{top:350,left:300}]}>
            <Text>{type_print}</Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Nombre:
            </Text>
            <Text style={styles.voucherText}>
              {name}
            </Text>
          </View>

          <View style={[styles.watermark,{top:450,left:20}]}>
            <Text>{type_print}</Text>
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
              Capital:
            </Text>
            <Text style={styles.voucherText}>
               $ {saldo_capital} USD
            </Text>
          </View>

          <View style={[styles.watermark,{top:550,left:300}]}>
            <Text>{type_print}</Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Interés:
            </Text>
            <Text style={styles.voucherText}>
               $ {interes} USD
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Mora:
            </Text>
            <Text style={styles.voucherText}>
              $ {mora} USD
            </Text>
          </View>
          
          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Seguro desgravamen:
            </Text>
            <Text style={styles.voucherText}>
               $ {seguro_desgravamen} USD
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Gastos de cobranza
            </Text>
            <Text style={styles.voucherText}>
               $ {gastos_cobranza} USD
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Gastos judiciales:
            </Text>
            <Text style={styles.voucherText}>
               $ {gastos_judiciales} USD
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Otros valores:
            </Text>
            <Text style={styles.voucherText}>
               $ {otros_valores} USD
            </Text>
          </View>

          {/* <View style={styles.sectionDates}>
            <Text style={styles.voucherTextBold}>
              Total pagado:
            </Text>
            <Text style={styles.voucherText}>
               $ {total} USD
            </Text>
          </View> */}

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Valor recibido:
            </Text>
            <Text style={styles.voucherText}>
               $ {valor_recibido} USD
            </Text>
          </View>

          {
            (tipo_transaccion!=='parcial' & forma_pago==='efectivo') &&
              <View style={styles.sectionDates}>
                <Text style={styles.voucherText}>
                  Valor devuelto:
                </Text>
                {
                  (valor_devuelto) &&
                    <Text style={styles.voucherText}>
                        $ {Number(valor_devuelto)} USD
                    </Text>
                }
              </View>
          }

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Forma de pago:
            </Text>
            <Text style={styles.voucherText}>
              {forma_pago.toUpperCase()}
            </Text>
          </View>
          

          <View style={[styles.watermark,{top:650,left:20}]}>
            <Text>{type_print}</Text>
          </View>

          <View style={styles.marginBottom}>

          </View>
        
          <View style={styles.sectionFooter}>
            <Text style={styles.voucherText}>
              Fecha:
            </Text>
            <Text style={styles.voucherText}>
               {fecha}
            </Text>
          </View>
          <View style={styles.sectionFooter}>
            <Text style={styles.voucherText}>
              Atendido por:
            </Text>
            <Text style={styles.voucherText}>
               {agente}
            </Text>
          </View>

        </Page>
      </Document>
    );
  }
  
  export default PDF;
  

//   <PDFDownloadLink document={<PDF />} fileName="myfirstpdf.pdf">
//         {({ loading, url, error, blob }) =>
//           loading ? (
//             <button>Loading Document ...</button>
//           ) : (
//             <button>Download now!</button>
//           )
//         }
//       </PDFDownloadLink>