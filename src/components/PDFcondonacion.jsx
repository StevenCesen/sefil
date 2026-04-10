import {
    Document,
    Text,
    Page,
    StyleSheet,
    Image,
    View,
  } from "@react-pdf/renderer";
import useFormatterNumber from "../hooks/useFormatterNumber";
import logo from '/icons/logo.png';

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

  const COL = { desc: '34%', orig: '22%', cond: '22%', cobrar: '22%' };

  function Row({ label, original, condonado, aCobrar, isHeader, isTotal }) {
    const bg = isHeader ? '#C6EFCE' : isTotal ? '#f0f0f0' : 'transparent';
    const weight = (isHeader || isTotal) ? 'bold' : 'normal';
    return (
      <View style={{width:'100%', borderTop: isHeader ? undefined : '1px solid black', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'row', backgroundColor: bg}}>
        <Text style={{width:COL.desc, borderRight:'1px solid black', padding:5, fontSize:8, textAlign:'center', fontWeight:weight}}>{label}</Text>
        <Text style={{width:COL.orig, borderRight:'1px solid black', padding:5, fontSize:8, textAlign:'center'}}>{original}</Text>
        <Text style={{width:COL.cond, borderRight:'1px solid black', padding:5, fontSize:8, textAlign:'center'}}>{condonado}</Text>
        <Text style={{width:COL.cobrar, padding:5, fontSize:8, textAlign:'center'}}>{aCobrar}</Text>
      </View>
    );
  }

  function PDFcondonacion({ci,credito,name,fecha,prevDates,postDates,invoiceValue,user_auth}) {
    const prev = JSON.parse(prevDates);
    const post = JSON.parse(postDates);
    const fmt = (v) => useFormatterNumber({value: v, currency:'USD'});

    const rows = [
      { label: 'Capital',               orig: prev.capital,            post: post.capital },
      { label: 'Interés',               orig: prev.interes,            post: post.interes },
      { label: 'Mora',                  orig: prev.mora,               post: post.mora },
      { label: 'Seguro desgravamen',    orig: prev.seguro_desgravamen, post: post.seguro_desgravamen },
      { label: 'Gastos judiciales',     orig: prev.gastos_judiciales,  post: post.gastos_judiciales },
      { label: 'Gastos cobranza FACES', orig: prev.gastos_cobranza,    post: post.gastos_cobranza },
      { label: 'Otros valores',         orig: prev.otros_valores,      post: post.otros_valores },
    ];

    const sefilTotal     = Number(prev.gastos_cobranza_sefil) + invoiceValue;
    const totalCondonado = rows.reduce((acc, r) => acc + (Number(r.orig) - Number(r.post)), 0);
    const totalACobrar   = rows.reduce((acc, r) => acc + Number(r.post), 0) + sefilTotal;

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

          <View style={{width:'100%',border:'1px solid black'}}>
            {/* Header */}
            <Row
              isHeader
              label="DESCRIPCIÓN"
              original="VALOR ORIGINAL"
              condonado="VALOR CONDONADO"
              aCobrar="VALOR A COBRAR"
            />

            {/* Condonable rows */}
            {rows.map((r) => (
              <Row
                key={r.label}
                label={r.label}
                original={fmt(r.orig)}
                condonado={fmt(Number(r.orig) - Number(r.post))}
                aCobrar={fmt(r.post)}
              />
            ))}

            {/* SEFIL row — not condonable: management_collection_expenses + invoice_value */}
            <Row
              label="Gastos cobranza SEFIL"
              original={fmt(sefilTotal)}
              condonado={fmt(0)}
              aCobrar={fmt(sefilTotal)}
            />

            {/* Total */}
            <Row
              isTotal
              label="TOTAL"
              original=""
              condonado={fmt(totalCondonado)}
              aCobrar={fmt(totalACobrar)}
            />
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

  export default PDFcondonacion;
