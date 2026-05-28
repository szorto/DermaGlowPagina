'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import { type Product, type Unidad } from '@/data/products';

interface OrderItem {
  _id: string; nombre: string; categoria: string;
  precio: number; precioNuevo?: number; cantidad: number; subtotal: number; sku?: string;
}
interface Order {
  _id: string; telefono: string; correo?: string;
  items: OrderItem[]; total: number;
  estado: 'pendiente' | 'en proceso' | 'completado' | 'cancelado';
  creadoEn: string;
}

const CATEGORIES = [
  'Protectores solares','Serums','Hidratantes','Limpieza facial','Limpieza corporal',
  'Acné','Antiedad','Mascarillas','Contorno de ojos','Labios','Capilar','Uñas',
  'Desodorantes','Sueño','Higiene íntima','Suplementos',
];
const UNIDADES: { value: Unidad; label: string }[] = [
  { value: 'ml',     label: 'ml'     },
  { value: 'g',      label: 'g'      },
  { value: 'mg',     label: 'mg'     },
  { value: 'oz',     label: 'oz'     },
  { value: 'unidad', label: 'unidad' },
];
const EMPTY_FORM: Omit<Product,'_id'> = {
  sku:'', nombre:'', marca:'', categoria:CATEGORIES[0], precio:0,
  estado:null, precioNuevo:undefined, imagen:'',
  subcategoria:'', description:'', highlights:[],
  cantidad:undefined, unidad:undefined,
};
const ORDER_ESTADOS = ['pendiente','en proceso','completado','cancelado'] as const;
const ORDERS_PER_PAGE = 10;
const fmt = (n:number) => new Intl.NumberFormat('es-HN',{style:'currency',currency:'HNL',minimumFractionDigits:0}).format(n);
const fmtDate = (d:string) => new Date(d).toLocaleString('es-HN',{dateStyle:'short',timeStyle:'short'});

function ProductBadge({estado}:{estado:Product['estado']}) {
  if (!estado) return null;
  const map:Record<string,string>={new:'Nuevo',sale:'Oferta',best:'Destacado'};
  return <span className={`${styles.badge} ${styles[`badge_${estado}`]}`}>{map[estado]}</span>;
}
function OrderStatusBadge({estado}:{estado:Order['estado']}) {
  return <span className={`${styles.badge} ${styles[`order_${estado.replace(' ','_')}`]}`}>{estado}</span>;
}
function Field({label,children}:{label:string;children:React.ReactNode}) {
  return <div className={styles.field}><label className={styles.label}>{label}</label>{children}</div>;
}

function ProductForm({initial,onSave,onClose}:{initial?:Product;onSave:(p:Product)=>void;onClose:()=>void}) {
  const isEdit = !!initial;
  const [form,setForm] = useState<Omit<Product,'_id'>>(initial?{...initial}:{...EMPTY_FORM});
  const [hlText,setHlText] = useState((initial?.highlights??[]).join('\n'));
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  function set<K extends keyof typeof form>(k:K,v:(typeof form)[K]){setForm(f=>({...f,[k]:v}));}
  async function handleSave() {
    if (!form.nombre.trim()||!form.categoria||!form.precio){setError('Nombre, categoría y precio son obligatorios.');return;}
    setSaving(true);setError('');
    const body={
      ...form,
      precio:Number(form.precio),
      precioNuevo:form.precioNuevo?Number(form.precioNuevo):undefined,
      highlights:hlText.split('\n').map(s=>s.trim()).filter(Boolean),
      cantidad:form.cantidad?Number(form.cantidad):undefined,
    };
    const res=await fetch(isEdit?`/api/products/${initial!._id}`:'/api/products',{method:isEdit?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    setSaving(false);
    if(!res.ok){const d=await res.json();setError(d.error??'Error guardando');return;}
    onSave(await res.json());
  }
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e=>e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isEdit?'Editar producto':'Nuevo producto'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.grid2}>
            <Field label="SKU"><input className={styles.input} value={form.sku??''} placeholder="Ej. DG-001" onChange={e=>set('sku',e.target.value.toUpperCase())} /></Field>
            <Field label="Nombre *"><input className={styles.input} value={form.nombre} onChange={e=>set('nombre',e.target.value)} /></Field>
          </div>
          <div className={styles.grid2}>
            <Field label="Marca"><input className={styles.input} value={form.marca??''} placeholder="Ej. La Roche-Posay" onChange={e=>set('marca',e.target.value)} /></Field>
            <Field label="Categoría *">
              <select className={styles.input} value={form.categoria} onChange={e=>set('categoria',e.target.value)}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <div className={styles.grid2}>
            <Field label="Estado / Badge">
              <select className={styles.input} value={form.estado??''} onChange={e=>set('estado',(e.target.value||null) as Product['estado'])}>
                <option value="">— Ninguno —</option>
                <option value="new">Nuevo</option><option value="sale">Oferta</option><option value="best">Destacado</option>
              </select>
            </Field>
            <Field label="Subcategoría"><input className={styles.input} value={form.subcategoria??''} placeholder="Ej. FPS 50+" onChange={e=>set('subcategoria',e.target.value)} /></Field>
          </div>
          <div className={styles.grid2}>
            <Field label="Precio (HNL) *"><input className={styles.input} type="number" min="0" value={form.precio} onChange={e=>set('precio',Number(e.target.value))} /></Field>
            <Field label="Precio con descuento"><input className={styles.input} type="number" min="0" value={form.precioNuevo??''} onChange={e=>set('precioNuevo',e.target.value?Number(e.target.value):undefined)} /></Field>
          </div>
          <div className={styles.grid2}>
            <Field label="Cantidad">
              <input className={styles.input} type="number" min="0" step="0.1" value={form.cantidad??''} placeholder="Ej. 50" onChange={e=>set('cantidad',e.target.value?Number(e.target.value):undefined)} />
            </Field>
            <Field label="Unidad">
              <select className={styles.input} value={form.unidad??''} onChange={e=>set('unidad',(e.target.value||undefined) as Unidad|undefined)}>
                <option value="">— Sin unidad —</option>
                {UNIDADES.map(u=><option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </Field>
          </div>
          <Field label="URL de imagen"><input className={styles.input} value={form.imagen??''} onChange={e=>set('imagen',e.target.value)} /></Field>
          <Field label="Descripción"><textarea className={`${styles.input} ${styles.textarea}`} rows={3} value={form.description??''} onChange={e=>set('description',e.target.value)} /></Field>
          <Field label="Highlights (uno por línea)"><textarea className={`${styles.input} ${styles.textarea}`} rows={3} value={hlText} onChange={e=>setHlText(e.target.value)} /></Field>
          {error&&<p className={styles.formError}>{error}</p>}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose} disabled={saving}>Cancelar</button>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving?'Guardando…':isEdit?'Guardar cambios':'Crear producto'}</button>
        </div>
      </div>
    </div>
  );
}

function OrderDetail({order,onClose,onStatusChange}:{order:Order;onClose:()=>void;onStatusChange:(id:string,estado:Order['estado'])=>void}) {
  const [saving,setSaving]=useState(false);
  async function handleStatus(estado:Order['estado']) {
    setSaving(true);
    const res=await fetch(`/api/orders/${order._id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({estado})});
    setSaving(false);
    if(res.ok) onStatusChange(order._id,estado);
  }
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e=>e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Pedido</h2>
            <p className={styles.orderMeta}>#{order._id.slice(-8).toUpperCase()} · {fmtDate(order.creadoEn)}</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.orderContact}>
            <div className={styles.contactRow}><span className={styles.contactIcon}>📞</span><span>{order.telefono}</span></div>
            {order.correo&&<div className={styles.contactRow}><span className={styles.contactIcon}>✉️</span><span>{order.correo}</span></div>}
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Producto</th><th style={{textAlign:'center'}}>Cant.</th><th style={{textAlign:'right'}}>Subtotal</th></tr></thead>
              <tbody>
                {order.items.map((item,i)=>(
                  <tr key={i}>
                    <td><div>{item.nombre}</div><div className={styles.tdMuted} style={{fontSize:'0.75rem'}}>{item.sku?`SKU: ${item.sku} · `:''}{item.categoria}</div></td>
                    <td style={{textAlign:'center'}}>{item.cantidad}</td>
                    <td style={{textAlign:'right'}}>{fmt(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{textAlign:'right',padding:'0.75rem 1rem',fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--brown-light)'}}>Total</td>
                  <td style={{textAlign:'right',padding:'0.75rem 1rem',fontFamily:'var(--font-display)',fontSize:'1.2rem',color:'var(--gold)',fontWeight:600}}>{fmt(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className={styles.statusSection}>
            <p className={styles.label}>Cambiar estado</p>
            <div className={styles.statusBtns}>
              {ORDER_ESTADOS.map(e=>(
                <button key={e} className={`${styles.statusBtn} ${order.estado===e?styles.statusBtnActive:''}`} onClick={()=>handleStatus(e)} disabled={saving||order.estado===e}>{e}</button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}><button className={styles.btnSecondary} onClick={onClose}>Cerrar</button></div>
      </div>
    </div>
  );
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [tab,setTab] = useState<'products'|'orders'>('products');
  const [products,setProducts]       = useState<Product[]>([]);
  const [loadingP,setLoadingP]       = useState(true);
  const [editTarget,setEditTarget]   = useState<Product|null>(null);
  const [showNewForm,setShowNewForm] = useState(false);
  const [deleteId,setDeleteId]       = useState<string|null>(null);
  const [deleting,setDeleting]       = useState(false);
  const [search,setSearch]           = useState('');
  const [filterCat,setFilterCat]     = useState('');
  const [allOrders,setAllOrders]         = useState<Order[]>([]);
  const [loadingO,setLoadingO]           = useState(false);
  const [filterEstado,setFilterEstado]   = useState('');
  const [ordersPage,setOrdersPage]       = useState(0);
  const [markingAll,setMarkingAll]       = useState(false);
  const [selectedOrder,setSelectedOrder] = useState<Order|null>(null);

  const loadProducts = useCallback(async()=>{
    setLoadingP(true);
    const res=await fetch('/api/products?limit=200');
    setProducts(await res.json());
    setLoadingP(false);
  },[]);

  const loadOrders = useCallback(async()=>{
    setLoadingO(true);
    const res=await fetch('/api/orders?limit=500');
    if(res.ok) setAllOrders(await res.json());
    setLoadingO(false);
  },[]);

  useEffect(()=>{loadProducts();},[loadProducts]);
  useEffect(()=>{if(tab==='orders') loadOrders();},[tab,loadOrders]);
  useEffect(()=>{setOrdersPage(0);},[filterEstado]);

  const filteredOrders = useMemo(()=>
    filterEstado ? allOrders.filter(o=>o.estado===filterEstado) : allOrders,
    [allOrders,filterEstado]
  );
  const totalPages = Math.max(1,Math.ceil(filteredOrders.length/ORDERS_PER_PAGE));
  const safePage   = Math.min(ordersPage,totalPages-1);
  const pageOrders = filteredOrders.slice(safePage*ORDERS_PER_PAGE,(safePage+1)*ORDERS_PER_PAGE);
  const pendingCount = allOrders.filter(o=>o.estado==='pendiente').length;

  async function handleLogout(){
    await fetch('/api/admin/logout',{method:'POST'});
    router.push('/admin');
  }
  async function handleDelete(id:string){
    setDeleting(true);
    const res=await fetch(`/api/products/${id}`,{method:'DELETE'});
    setDeleting(false);
    if(res.ok){setProducts(p=>p.filter(x=>x._id!==id));setDeleteId(null);}
  }
  function handleSaved(saved:Product){
    setProducts(prev=>{
      const idx=prev.findIndex(p=>p._id===saved._id);
      if(idx>=0){const n=[...prev];n[idx]=saved;return n;}
      return [saved,...prev];
    });
    setEditTarget(null);setShowNewForm(false);
  }
  async function handleMarkAllComplete(){
    const targets=filteredOrders.filter(o=>o.estado!=='completado');
    if(targets.length===0) return;
    if(!confirm(`¿Marcar ${targets.length} pedido(s) como completados?`)) return;
    setMarkingAll(true);
    await Promise.all(targets.map(o=>fetch(`/api/orders/${o._id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({estado:'completado'})})));
    setAllOrders(prev=>prev.map(o=>targets.find(t=>t._id===o._id)?{...o,estado:'completado' as Order['estado']}:o));
    setMarkingAll(false);
  }
  function handleStatusChange(id:string,estado:Order['estado']){
    setAllOrders(prev=>prev.map(o=>o._id===id?{...o,estado}:o));
    if(selectedOrder?._id===id) setSelectedOrder(o=>o?{...o,estado}:o);
  }

  // Search by name, SKU, or marca
  const filteredProducts = products.filter(p=>{
    const q=search.toLowerCase();
    const ms=!search
      ||p.nombre.toLowerCase().includes(q)
      ||(p.sku?.toLowerCase().includes(q)??false)
      ||(p.marca?.toLowerCase().includes(q)??false);
    const mc=!filterCat||p.categoria===filterCat;
    return ms&&mc;
  });

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>Derma<span>Glow</span></div>
        <p className={styles.sidebarRole}>Admin</p>
        <nav className={styles.sidebarNav}>
          <button className={`${styles.navItem} ${tab==='products'?styles.navItemActive:''}`} onClick={()=>setTab('products')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            Productos
          </button>
          <button className={`${styles.navItem} ${tab==='orders'?styles.navItemActive:''}`} onClick={()=>setTab('orders')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Pedidos
            {pendingCount>0&&<span className={styles.navBadge}>{pendingCount}</span>}
          </button>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </button>
      </aside>

      <main className={styles.main}>
        {tab==='products'&&(
          <>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Productos</h1>
                <p className={styles.pageSubtitle}>{filteredProducts.length} de {products.length} productos</p>
              </div>
              <button className={styles.btnPrimary} onClick={()=>setShowNewForm(true)}>+ Nuevo producto</button>
            </div>
            <div className={styles.filters}>
              <input className={styles.input} placeholder="Buscar por nombre, SKU o marca…" value={search} onChange={e=>setSearch(e.target.value)} />
              <select className={styles.input} value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
                <option value="">Todas las categorías</option>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <button className={styles.btnSecondary} onClick={loadProducts}>↺ Refrescar</button>
            </div>
            {loadingP?(
              <div className={styles.loading}>Cargando productos…</div>
            ):(
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr><th>SKU</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {filteredProducts.length===0?(
                      <tr><td colSpan={6} className={styles.emptyRow}>No hay productos</td></tr>
                    ):filteredProducts.map(p=>(
                      <tr key={p._id}>
                        <td className={styles.tdMuted} style={{fontFamily:'monospace',fontSize:'0.75rem'}}>{p.sku??'—'}</td>
                        <td className={styles.tdName}>
                          {p.imagen&&<img src={p.imagen} alt={p.nombre} className={styles.thumb}/>}
                          <span>{p.marca?`${p.marca} `:''}{p.nombre}</span>
                        </td>
                        <td className={styles.tdMuted}>{p.categoria}</td>
                        <td>
                          {p.precioNuevo!=null
                            ?<span><span className={styles.priceNew}>L {p.precioNuevo.toLocaleString()}</span> <span className={styles.priceOld}>L {p.precio.toLocaleString()}</span></span>
                            :<span>L {p.precio.toLocaleString()}</span>}
                        </td>
                        <td><ProductBadge estado={p.estado}/></td>
                        <td className={styles.tdActions}>
                          <button className={styles.editBtn} onClick={()=>setEditTarget(p)}>Editar</button>
                          <button className={styles.deleteBtn} onClick={()=>setDeleteId(p._id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab==='orders'&&(
          <>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Pedidos</h1>
                <p className={styles.pageSubtitle}>
                  {filteredOrders.length} pedido{filteredOrders.length!==1?'s':''}
                  {filterEstado?` · ${filterEstado}`:''}
                  {filteredOrders.length>0?` · Página ${safePage+1} de ${totalPages}`:''}
                </p>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.btnSecondary} onClick={loadOrders} disabled={loadingO}>↺ Refrescar</button>
                <button className={styles.btnPrimary} onClick={handleMarkAllComplete} disabled={markingAll||filteredOrders.every(o=>o.estado==='completado')}>
                  {markingAll?'Procesando…':'✓ Todos completos'}
                </button>
              </div>
            </div>
            <div className={styles.statusTabs}>
              {(['', ...ORDER_ESTADOS] as const).map(e=>(
                <button key={e} className={`${styles.statusTab} ${filterEstado===e?styles.statusTabActive:''}`} onClick={()=>setFilterEstado(e)}>
                  {e===''?'Todos':e.charAt(0).toUpperCase()+e.slice(1)}
                  <span className={styles.tabCountNeutral}>{e===''?allOrders.length:allOrders.filter(o=>o.estado===e).length}</span>
                </button>
              ))}
            </div>
            {loadingO?(
              <div className={styles.loading}>Cargando pedidos…</div>
            ):filteredOrders.length===0?(
              <div className={styles.ordersPlaceholder}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <h2>Sin pedidos</h2>
                <p>Aún no hay pedidos{filterEstado?` con estado "${filterEstado}"`:''}.</p>
              </div>
            ):(
              <>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>ID</th><th>Teléfono</th><th>Productos</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Ver</th></tr></thead>
                    <tbody>
                      {pageOrders.map(o=>(
                        <tr key={o._id}>
                          <td className={styles.tdMuted} style={{fontFamily:'monospace',fontSize:'0.75rem'}}>#{o._id.slice(-8).toUpperCase()}</td>
                          <td>{o.telefono}</td>
                          <td className={styles.tdMuted}>{o.items.length} producto{o.items.length!==1?'s':''}</td>
                          <td><span className={styles.priceNew}>{fmt(o.total)}</span></td>
                          <td><OrderStatusBadge estado={o.estado}/></td>
                          <td className={styles.tdMuted} style={{fontSize:'0.75rem'}}>{fmtDate(o.creadoEn)}</td>
                          <td><button className={styles.editBtn} onClick={()=>setSelectedOrder(o)}>Ver</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.pagination}>
                  <button className={styles.btnSecondary} onClick={()=>setOrdersPage(p=>p-1)} disabled={safePage===0}>← Anterior</button>
                  <span className={styles.pageIndicator}>{safePage+1} / {totalPages}</span>
                  <button className={styles.btnSecondary} onClick={()=>setOrdersPage(p=>p+1)} disabled={safePage>=totalPages-1}>Siguiente →</button>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {(showNewForm||editTarget)&&(
        <ProductForm initial={editTarget??undefined} onSave={handleSaved} onClose={()=>{setEditTarget(null);setShowNewForm(false);}}/>
      )}
      {deleteId&&(
        <div className={styles.modalOverlay} onClick={()=>setDeleteId(null)}>
          <div className={styles.confirmModal} onClick={e=>e.stopPropagation()}>
            <h3>¿Eliminar producto?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className={styles.confirmBtns}>
              <button className={styles.btnSecondary} onClick={()=>setDeleteId(null)} disabled={deleting}>Cancelar</button>
              <button className={styles.deleteBtnConfirm} onClick={()=>handleDelete(deleteId)} disabled={deleting}>{deleting?'Eliminando…':'Sí, eliminar'}</button>
            </div>
          </div>
        </div>
      )}
      {selectedOrder&&(
        <OrderDetail order={selectedOrder} onClose={()=>setSelectedOrder(null)} onStatusChange={handleStatusChange}/>
      )}
    </div>
  );
}
