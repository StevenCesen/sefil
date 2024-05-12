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
    //Para 1/4 de hoja


  });
  
  function PDF({nro_voucher,type_print,tipo_transaccion,credito,forma_pago,insitucion_financiera,codigo_deposito,name,ci,mora,interes,seguro_desgravamen,gastos_judiciales,saldo_capital,gastos_cobranza,otros_valores,total,valor_recibido,valor_devuelto,fecha,agente}) {
    return (
      <Document>
        <Page style={styles.page}>
        
          <View style={{padding:20}}>
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

            <View style={styles.sectionDates}>
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

            {
              (saldo_capital>0) &&
                <View style={styles.sectionDates}>
                  <Text style={styles.voucherText}>
                    Capital:
                  </Text>
                  <Text style={styles.voucherText}>
                    {useFormatterNumber({value:saldo_capital,currency:'USD'})}
                  </Text>
                </View>
            }

            {
              (interes>0) &&
                <View style={styles.sectionDates}>
                  <Text style={styles.voucherText}>
                    Interés:
                  </Text>
                  <Text style={styles.voucherText}>
                    {useFormatterNumber({value:interes,currency:'USD'})}
                  </Text>
                </View>
            }

            {
              (mora>0) &&
              <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Mora:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:mora,currency:'USD'})}
              </Text>
            </View>
            }

{
              (seguro_desgravamen>0) &&
              <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Seguro desgravamen:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:seguro_desgravamen,currency:'USD'})}
              </Text>
            </View>
            }

            {
              (gastos_cobranza>0) &&
              <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Gastos de cobranza
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:gastos_cobranza,currency:'USD'})}
              </Text>
            </View>
            }

            {
              (gastos_judiciales>0) &&
              <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Gastos judiciales:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:gastos_judiciales,currency:'USD'})}
              </Text>
            </View>
            }

            {
              (otros_valores>0) &&
              <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Otros valores:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:otros_valores,currency:'USD'})}
              </Text>
            </View>
            }

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
                {/* {`${forma_pago.substring(0,1).toUpperCase()}${forma_pago.substring(1)}`}: */}
                TOTAL:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:valor_recibido,currency:'USD'})}
              </Text>
            </View>

            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Saldo a favor:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:valor_devuelto,currency:'USD'})}
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
                          {useFormatterNumber({value:valor_devuelto,currency:'USD'})}
                      </Text>
                  }
                </View>
            }

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
          
          </View>
  
          <View style={{padding:20}}>
            <View style={[styles.section]}>
              <Text style={styles.title}>
                COMPROBANTE DE PAGO
              </Text>
              <Image style={styles.image} src={"./icons/logo.png"}/>
            </View>

              <View style={styles.voucherNumber}>
                  <Text>No. {nro_voucher}</Text>
              </View>

            <View style={styles.sectionDates}>
              <Text style={[styles.voucherText]} wrap={true}>
                Nombre:
              </Text>
              <Text style={styles.voucherText}>
                {name}
              </Text>
            </View>

            <View style={[styles.watermark,{top:50,left:100}]}>
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
                Crédito:
              </Text>
              <Text style={styles.voucherText}>
                {credito}
              </Text>
            </View>

            {
              (saldo_capital>0) &&
                <View style={styles.sectionDates}>
                  <Text style={styles.voucherText}>
                    Capital:
                  </Text>
                  <Text style={styles.voucherText}>
                    {useFormatterNumber({value:saldo_capital,currency:'USD'})}
                  </Text>
                </View>
            }

            <View style={[styles.watermark,{top:150,left:20}]}>
              <Text>{type_print}</Text>
            </View>

            {
              (interes>0) &&
                <View style={styles.sectionDates}>
                  <Text style={styles.voucherText}>
                    Interés:
                  </Text>
                  <Text style={styles.voucherText}>
                    {useFormatterNumber({value:interes,currency:'USD'})}
                  </Text>
                </View>
            }

            {
              (mora>0) &&
              <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Mora:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:mora,currency:'USD'})}
              </Text>
            </View>
            }

{
              (seguro_desgravamen>0) &&
              <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Seguro desgravamen:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:seguro_desgravamen,currency:'USD'})}
              </Text>
            </View>
            }

            {
              (gastos_cobranza>0) &&
              <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Gastos de cobranza
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:gastos_cobranza,currency:'USD'})}
              </Text>
            </View>
            }

            {
              (gastos_judiciales>0) &&
              <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Gastos judiciales:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:gastos_judiciales,currency:'USD'})}
              </Text>
            </View>
            }

            {
              (otros_valores>0) &&
              <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Otros valores:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:otros_valores,currency:'USD'})}
              </Text>
            </View>
            }

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
                {`${forma_pago.substring(0,1).toUpperCase()}${forma_pago.substring(1)}`}:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:valor_recibido,currency:'USD'})}
              </Text>
            </View>

            <View style={styles.sectionDates}>
              <Text style={styles.voucherText}>
                Saldo a favor:
              </Text>
              <Text style={styles.voucherText}>
                {useFormatterNumber({value:valor_devuelto,currency:'USD'})}
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
                          {useFormatterNumber({value:valor_devuelto,currency:'USD'})}
                      </Text>
                  }
                </View>
            }

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
            

            <View style={[styles.watermark,{top:250,left:150}]}>
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
              <Text style={[styles.voucherText]}>
                SEFIL SA
              </Text>
            </View>
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