// Browser-local activity inbox. A backend must replace this for cross-device delivery.
const notificationsKey='handdeck-player-notifications-v1';
function notificationRecords(){
 const saved=store.read(notificationsKey,[]);
 return Array.isArray(saved)?saved.filter(item=>item&&typeof item.id==='string'&&typeof item.recipientId==='string'):[];
}
function notificationsForPlayer(id=profile?.id){
 return notificationRecords().filter(item=>item.recipientId===id).sort((a,b)=>Date.parse(b.createdAt||0)-Date.parse(a.createdAt||0));
}
function addNotification(recipientId,type,{actorId=profile?.id,postId='',deckId='',badgeTitle=''}={}){
 if(!recipientId||!profiles.some(item=>item.id===recipientId)||actorId===recipientId&&type!=='badge')return false;
 const list=notificationRecords();
 list.push({id:newLocalId(),recipientId,actorId,type,postId,deckId,badgeTitle,createdAt:new Date().toISOString(),readAt:null});
 if(!store.write(notificationsKey,list.slice(-250)))return false;
 renderNotifications();return true;
}
function notificationCopy(item){
 const actor=profiles.find(player=>player.id===item.actorId)?.name||'A player';
 const labels={follow:`${actor} followed you`,like:`${actor} liked your post`,comment:`${actor} commented on your post`,match_request:`${actor} tagged you in a Match`,match_verified:`${actor} verified your Match`,match_declined:`${actor} declined your Match`,badge:`You earned ${item.badgeTitle||'a new badge'}`};
 return labels[item.type]||'New activity on Hand Deck';
}
function renderNotifications(){
 const menu=document.getElementById('notification-menu');if(!menu)return;
 const wasOpen=menu.open,items=signedIn()?notificationsForPlayer():[],unread=items.filter(item=>!item.readAt).length;
 menu.innerHTML=`<summary class="notification-trigger" aria-label="Notifications${unread?`, ${unread} unread`:''}" title="Notifications">${svg('bell')}${unread?`<span class="notification-count">${unread>9?'9+':unread}</span>`:''}</summary><div class="notification-panel"><div class="notification-heading"><div><span>ACTIVITY</span><h2>Notifications</h2></div>${unread?'<button type="button" data-notification-action="read-all">Mark all read</button>':''}</div>${items.length?`<div class="notification-list">${items.slice(0,30).map(item=>{const actor=profiles.find(player=>player.id===item.actorId);return `<button type="button" class="notification-item ${item.readAt?'':'unread'}" data-notification-id="${esc(item.id)}"><span class="notification-avatar">${actor?`<img src="assets/handdeck-spirit-${esc(actor.mascot)}.webp" alt="">`:svg(item.type==='badge'?'badge':'match')}</span><span><strong>${esc(notificationCopy(item))}</strong><small>${esc(postDate(item.createdAt))}</small></span>${item.readAt?'':'<i aria-label="Unread"></i>'}</button>`;}).join('')}</div>`:'<p class="notification-empty">No activity yet. Follows, reactions, comments, and Match requests will appear here.</p>'}<p class="notification-note">Activity on this browser only.</p></div>`;
 menu.open=wasOpen;
}
function markNotificationRead(id){
 const items=notificationRecords(),item=items.find(entry=>entry.id===id&&entry.recipientId===profile?.id);
 if(!item)return null;
 if(!item.readAt){item.readAt=new Date().toISOString();store.write(notificationsKey,items);}
 renderNotifications();return item;
}
function removePostNotifications(postId){
 const items=notificationRecords();store.write(notificationsKey,items.filter(item=>item.postId!==postId));renderNotifications();
}
function cleanupDeletedProfileNotifications(id){
 const items=notificationRecords();store.write(notificationsKey,items.filter(item=>item.recipientId!==id&&item.actorId!==id));renderNotifications();
}
document.addEventListener('click',event=>{
 const menu=document.getElementById('notification-menu');
 const all=event.target.closest('[data-notification-action="read-all"]');
 if(all){const now=new Date().toISOString(),items=notificationRecords().map(item=>item.recipientId===profile?.id&&!item.readAt?{...item,readAt:now}:item);store.write(notificationsKey,items);renderNotifications();return;}
 const button=event.target.closest('[data-notification-id]');
 if(button){const item=markNotificationRead(button.dataset.notificationId);if(!item)return;menu.open=false;
  if(item.type==='badge'){navigate('badges');return;}
  if(item.type==='follow'&&profiles.some(player=>player.id===item.actorId)){navigate('player/'+encodeURIComponent(item.actorId));return;}
  navigate('feed');if(item.postId)setTimeout(()=>document.getElementById('post-'+item.postId)?.scrollIntoView({behavior:'smooth',block:'center'}),80);return;
 }
 if(menu?.open&&!menu.contains(event.target))menu.open=false;
});
