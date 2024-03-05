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
      backgroundColor: "white",
      padding: 10,
      position:'relative'
    },
    watermark:{
      position:'absolute',
      fontSize:30,
      color:'rgba(219, 219, 219, 0.514)',
      zIndex:0
    },
    title: {
      width:"50%",
      fontSize: 12,
      textAlign: "center",
      fontWeight: "ultrabold",
    },
    section: {
      display: "flex",
      flexDirection: "row",
      alignItems:"center",
      margin: 5,
      width:"50%",
      padding: 0,
    },
    sectionDates: {
        display: "flex",
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems:"center",
        margin: 2,
        width:"50%",
        fontSize:10,
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
        width:"50%",
        fontSize:15,
        textAlign:"right",
        marginTop:10,
        marginBottom:10,
        paddingRight:10
    },
    voucherText:{
        width:"50%",
        paddingLeft:5,
        paddingRight:5
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
        justifyContent:"space-between",
        alignItems:"center",
        marginLeft:5,
        width:"50%",
        fontSize:10,
        fontWeight:"100"
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
    //Para 1/4 de hoja


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
            <Image style={styles.image} src={"./icons/logo.png"}/>
          </View>

            <View style={styles.voucherNumber}>
                <Text>No. {nro_voucher}</Text>
            </View>

          <View style={[styles.watermark,{top:120,left:150}]}>
            <Text>{type_print}</Text>
          </View>

          <View style={[styles.watermark,{top:250,left:20}]}>
            <Text>{type_print}</Text>
          </View>

          <View style={[styles.watermark,{top:350,left:150}]}>
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

          {/* <View style={[styles.watermark,{top:450,left:20}]}>
            <Text>{type_print}</Text>
          </View> */}

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
               $ {saldo_capital}
            </Text>
          </View>

          {/* <View style={[styles.watermark,{top:550,left:150}]}>
            <Text>{type_print}</Text>
          </View> */}

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Interés:
            </Text>
            <Text style={styles.voucherText}>
               $ {interes}
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Mora:
            </Text>
            <Text style={styles.voucherText}>
              $ {mora}
            </Text>
          </View>
          
          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Seguro desgravamen:
            </Text>
            <Text style={styles.voucherText}>
               $ {seguro_desgravamen}
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Gastos de cobranza
            </Text>
            <Text style={styles.voucherText}>
               $ {gastos_cobranza}
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Gastos judiciales:
            </Text>
            <Text style={styles.voucherText}>
               $ {gastos_judiciales}
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Otros valores:
            </Text>
            <Text style={styles.voucherText}>
               $ {otros_valores}
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
               $ {valor_recibido}
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
                        $ {Number(valor_devuelto)}
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
          

          {/* <View style={[styles.watermark,{top:650,left:20}]}>
            <Text>{type_print}</Text>
          </View> */}

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

          <View style={[styles.sectionFooter,{marginTop:20,marginLeft:80}]}>
            <Text style={styles.voucherText}>
            
            </Text>
            <Text style={[styles.voucherText]}>
              CLIENTE
            </Text>
          </View>

          
          {/* <View style={[styles.watermark,{top:50,left:20}]}>
            <Text>{type_print}</Text>
          </View> */}
          <View style={[styles.section,{marginTop:80}]}>
            <Text style={styles.title}>
              COMPROBANTE DE PAGO
            </Text>
            <Image style={styles.image} src={"./icons/logo.png"}/>
          </View>

            <View style={styles.voucherNumber}>
                <Text>No. {nro_voucher}</Text>
            </View>

          {/* <View style={[styles.watermark,{top:120,left:150}]}>
            <Text>{type_print}</Text>
          </View>

          <View style={[styles.watermark,{top:250,left:20}]}>
            <Text>{type_print}</Text>
          </View> */}

          
          {/* <View style={[styles.watermark,{top:350,left:150}]}>
            <Text>{type_print}</Text>
          </View> */}

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
               $ {saldo_capital}
            </Text>
          </View>

          <View style={[styles.watermark,{top:550,left:150}]}>
            <Text>{type_print}</Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Interés:
            </Text>
            <Text style={styles.voucherText}>
               $ {interes}
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Mora:
            </Text>
            <Text style={styles.voucherText}>
              $ {mora}
            </Text>
          </View>
          
          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Seguro desgravamen:
            </Text>
            <Text style={styles.voucherText}>
               $ {seguro_desgravamen}
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Gastos de cobranza
            </Text>
            <Text style={styles.voucherText}>
               $ {gastos_cobranza}
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Gastos judiciales:
            </Text>
            <Text style={styles.voucherText}>
               $ {gastos_judiciales}
            </Text>
          </View>

          <View style={styles.sectionDates}>
            <Text style={styles.voucherText}>
              Otros valores:
            </Text>
            <Text style={styles.voucherText}>
               $ {otros_valores}
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
               $ {valor_recibido}
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
                        $ {Number(valor_devuelto)}
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
          <View style={[styles.sectionFooter,{marginTop:20,marginLeft:80}]}>
            <Text style={styles.voucherText}>
          
            </Text>
            <Text style={styles.voucherText}>
              SEFIL SA
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